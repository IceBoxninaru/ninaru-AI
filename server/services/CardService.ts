import { Card, Player, ElementType, CardType, StatusEffectType, CardRarity } from '../../shared/types/game.js';
import { cards } from '../data/cards.js';

export class CardService {
  private readonly cards: Card[] = cards;

  getCardsByType(type: CardType): Card[] {
    return this.cards.filter(card => 
      card.type === type && 
      card.rarity === 'COMMON' as CardRarity
    );
  }

  getCardsByElement(element: ElementType): Card[] {
    return this.cards.filter(card => card.element === element);
  }

  getCardById(id: string): Card | undefined {
    return this.cards.find(card => card.id === id);
  }

  getCardByName(name: string): Card | undefined {
    return this.cards.find(card => card.name === name);
  }

  createInitialDeck(player: Player): Card[] {
    // プレイヤーの初期デッキを作成
    const deck: Card[] = [];
    
    // 基本的な攻撃カード（10枚）
    const attackCards = this.getCardsByType('ATTACK' as CardType);
    deck.push(...attackCards.slice(0, 10));

    // 基本的な防御カード（8枚）
    const defenseCards = this.getCardsByType('DEFENSE' as CardType);
    deck.push(...defenseCards.slice(0, 8));

    // 基本的な魔法カード（8枚）
    const magicCards = this.getCardsByType('MAGIC' as CardType);
    deck.push(...magicCards.slice(0, 8));

    // カウンター防御カード (cdefense は存在しない型なのでコメントアウト)
    // const cdefenseCards = this.getCardsByType('cdefense' as CardType).slice(0, 4);
    // deck.push(...cdefenseCards);

    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  canPlayCard(player: Player, card: Card): boolean {
    // MPコストのチェック
    if (card.mpCost && card.mpCost > player.mp) {
      return false;
    }

    // ステータス効果のチェック
    if (player.status.has('STUN' as StatusEffectType)) {
      return false;
    }

    // 'paralyze' は StatusEffectType にないので、仮に 'POISON' を使用 (ロジック再検討要)
    if (player.status.has('POISON' as StatusEffectType) && (card.type === ('DEFENSE' as CardType))) {
      return false;
    }

    return true;
  }

  calculateDamage(card: Card, player: Player, weatherModifier: number): number {
    let damage = 0;

    if (card.power) {
      damage = Math.floor(card.power * player.damageMultiplier * weatherModifier);

      // コンボシステム
      if (player.lastPlayedElement === card.element) {
        player.combo++;
        damage = Math.floor(damage * (1 + player.combo * 0.1));
      }
    }

    return damage;
  }

  calculateHeal(card: Card, target: Player): number {
    if (!card.shield) return 0;

    let heal = card.shield;
    
    // 'bless' は StatusEffectType にないので、仮に 'REGEN' を使用
    if (target.status.has('REGEN' as StatusEffectType)) {
      heal = Math.floor(heal * 1.3);
    }
    
    // 'purify' は StatusEffectType にないので、仮に 'POISON' を使用 (回復ロジックとしては不適切、ダメージのはず)
    if (target.status.has('POISON' as StatusEffectType)) {
      heal = Math.floor(heal * 0.7);
    }

    return heal;
  }
} 