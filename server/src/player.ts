import { IPlayer, ICardData, IStatusEffect, StatusEffectType, ElementKind } from '../../shared/types/game';
import { generateInitialDeck } from '../schema/cards';

export class Player implements IPlayer {
  id: string;
  name: string;
  hp: number = 100;
  maxHp: number = 100;
  mp: number = 50;
  maxMp: number = 50;
  gold: number;
  faith: number = 0;
  maxFaith: number = 100;
  combo: number = 0;
  maxCombo: number = 5;
  hand: ICardData[] = [];
  deck: ICardData[] = [];
  discardPile: ICardData[] = [];
  statusEffects: IStatusEffect[] = [];
  status: Map<StatusEffectType, number> = new Map();
  mpCostMultiplier: number = 1;
  damageMultiplier: number = 1;
  damageReceivedMultiplier: number = 1;
  lastPlayedElement?: ElementKind;
  team?: number;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
    this.gold = 0;
    this.deck = generateInitialDeck();
    this.drawInitialHand();
  }

  private drawInitialHand(): void {
    for (let i = 0; i < 5; i++) {
      this.drawCard();
    }
  }

  drawCard(): void {
    if (this.deck.length === 0) {
      // デッキが空の場合、捨て札をシャッフルしてデッキにする
      this.deck = [...this.discardPile];
      this.discardPile = [];
      this.shuffleDeck();
    }

    if (this.deck.length > 0) {
      const card = this.deck.pop();
      if (card) {
        this.hand.push(card);
      }
    }
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  playCard(cardIndex: number): ICardData | null {
    if (cardIndex < 0 || cardIndex >= this.hand.length) {
      return null;
    }

    const card = this.hand[cardIndex];
    if (this.mp < card.mpCost * this.mpCostMultiplier) {
      return null;
    }

    this.hand.splice(cardIndex, 1);
    this.discardPile.push(card);
    this.mp -= Math.floor(card.mpCost * this.mpCostMultiplier);

    return card;
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - Math.floor(amount * this.damageReceivedMultiplier));
  }

  heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  gainMp(amount: number): void {
    this.mp = Math.min(this.maxMp, this.mp + amount);
  }

  addFaith(amount: number): void {
    this.faith = Math.min(this.maxFaith, this.faith + amount);
  }

  updateStatusEffects(): void {
    this.statusEffects = this.statusEffects.filter(effect => {
      switch (effect.type) {
        case 'POISON':
          this.hp -= effect.value;
          break;
        case 'BURN':
          this.hp -= effect.value;
          break;
        case 'REGENERATION':
          this.hp = Math.min(this.maxHp, this.hp + effect.value);
          break;
      }
      
      effect.duration--;
      return effect.duration > 0;
    });
  }

  addStatus(effect: StatusEffectType, duration: number): void {
    const statusEffect: IStatusEffect = {
      type: effect,
      name: effect,
      duration: duration,
      description: `${effect}効果`,
      value: effect === 'POISON' ? 5 : effect === 'BURN' ? 3 : 5
    };
    this.statusEffects.push(statusEffect);
  }

  removeStatus(effect: StatusEffectType): void {
    this.statusEffects = this.statusEffects.filter(s => s.type !== effect);
  }

  updateStatuses(): void {
    for (const [effect, duration] of this.status.entries()) {
      if (duration <= 1) {
        this.status.delete(effect);
      } else {
        this.status.set(effect, duration - 1);
      }
    }
  }

  addStatusEffect(effect: IStatusEffect): void {
    this.statusEffects.push(effect);
  }

  spendMp(amount: number): void {
    this.mp = Math.max(0, this.mp - Math.floor(amount * this.mpCostMultiplier));
  }

  spendFaith(amount: number): void {
    this.faith = Math.max(0, this.faith - amount);
  }

  addCombo(amount: number): void {
    this.combo = Math.min(this.maxCombo, this.combo + amount);
  }

  resetCombo(): void {
    this.combo = 0;
  }
} 