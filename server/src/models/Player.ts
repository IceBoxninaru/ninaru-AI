import { IPlayer, ICardData, StatusEffectType, ElementKind, CardType, CardRarity, DEFAULT_GAME_CONFIG } from '../../../shared/types/game.js';

export class Player implements IPlayer {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  faith: number;
  maxFaith: number;
  combo: number;
  maxCombo: number;
  gold: number;
  hand: ICardData[];
  deck: ICardData[];
  discardPile: ICardData[];
  statusEffects: { type: StatusEffectType; duration: number }[];
  status: Map<StatusEffectType, number>;
  damageMultiplier: number;
  mpCostMultiplier: number;
  damageReceivedMultiplier: number;
  lastPlayedElement?: ElementKind;
  team?: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hp = DEFAULT_GAME_CONFIG.initialHP;
    this.maxHp = DEFAULT_GAME_CONFIG.initialHP;
    this.mp = DEFAULT_GAME_CONFIG.initialMP;
    this.maxMp = DEFAULT_GAME_CONFIG.initialMP;
    this.faith = 0;
    this.maxFaith = DEFAULT_GAME_CONFIG.maxFaith;
    this.combo = 0;
    this.maxCombo = DEFAULT_GAME_CONFIG.maxCombo;
    this.gold = 0;
    this.hand = [];
    this.deck = [];
    this.discardPile = [];
    this.statusEffects = [];
    this.status = new Map();
    this.damageMultiplier = 1;
    this.mpCostMultiplier = 1;
    this.damageReceivedMultiplier = 1;
  }

  drawCard(): void {
    if (this.deck.length === 0) {
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

  playCard(cardIndex: string): ICardData | null {
    const index = Number(cardIndex);
    if (index < 0 || index >= this.hand.length) {
      return null;
    }
    const card = this.hand[index];
    this.hand.splice(index, 1);
    this.discardPile.push(card);
    if (card.element) {
      this.lastPlayedElement = card.element;
    }
    return card;
  }

  canPlayCard(card: ICardData): boolean {
    if (card.mpCost > this.mp) {
      return false;
    }
    if (this.hasStatusEffect(StatusEffectType.STUN)) {
      return false;
    }
    return true;
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
  }

  heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  gainMp(amount: number): void {
    this.mp = Math.min(this.maxMp, this.mp + amount);
  }

  spendMp(amount: number): void {
    this.mp = Math.max(0, this.mp - amount);
  }

  addFaith(amount: number): void {
    this.faith = Math.min(this.maxFaith, this.faith + amount);
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

  isCriticalHit(): boolean {
    return Math.random() < 0.1 + (this.combo * 0.05);
  }

  addStatus(effect: StatusEffectType, duration: number): void {
    this.statusEffects.push({ type: effect, duration });
  }

  removeStatus(effect: StatusEffectType): void {
    this.statusEffects = this.statusEffects.filter(s => s.type !== effect);
  }

  hasStatusEffect(effect: StatusEffectType): boolean {
    return this.statusEffects.some(s => s.type === effect);
  }

  updateStatuses(): void {
    this.statusEffects = this.statusEffects.filter(effect => {
      if (effect.duration > 0) {
        effect.duration--;
        return true;
      }
      return false;
    });
  }

  isAlive(): boolean {
    return this.hp > 0;
  }

  resetForNewGame(): void {
    this.hp = DEFAULT_GAME_CONFIG.initialHP;
    this.mp = DEFAULT_GAME_CONFIG.initialMP;
    this.faith = 0;
    this.combo = 0;
    this.damageMultiplier = 1;
    this.mpCostMultiplier = 1;
    this.damageReceivedMultiplier = 1;
    this.lastPlayedElement = undefined;
    this.hand = [];
    this.discardPile = [];
    this.statusEffects = [];
    this.status.clear();
    this.deck = this.generateInitialDeck();
    this.shuffleDeck();
    for (let i = 0; i < DEFAULT_GAME_CONFIG.initialHandSize; i++) {
      this.drawCard();
    }
  }

  private generateInitialDeck(): ICardData[] {
    const deck: ICardData[] = [];
    for (let i = 0; i < DEFAULT_GAME_CONFIG.deckSize; i++) {
      deck.push({
        id: `card_${i}`,
        name: `Card ${i}`,
        type: CardType.ATTACK,
        power: 100,
        mpCost: 50,
        description: 'A basic card',
        rarity: CardRarity.COMMON
      });
    }
    return deck;
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
}