import { IGameState, IPlayer, ICardData, WeatherKind, StatusEffectType, ElementKind, IStatusEffect } from '../../../shared/types/game';

class Player implements IPlayer {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  faith: number;
  combo: number;
  maxCombo: number;
  gold: number;
  hand: ICardData[];
  deck: ICardData[];
  discardPile: ICardData[];
  status: Map<StatusEffectType, number>;
  statusEffects: IStatusEffect[];
  damageMultiplier: number;
  mpCostMultiplier: number;
  damageReceivedMultiplier: number;
  lastPlayedElement?: ElementKind;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hp = 30;
    this.maxHp = 30;
    this.mp = 5;
    this.maxMp = 5;
    this.faith = 0;
    this.combo = 0;
    this.maxCombo = 5;
    this.gold = 0;
    this.hand = [];
    this.deck = [];
    this.discardPile = [];
    this.status = new Map();
    this.statusEffects = [];
    this.damageMultiplier = 1;
    this.mpCostMultiplier = 1;
    this.damageReceivedMultiplier = 1;
  }

  drawCard(): void {
    if (this.deck.length === 0) {
      this.deck = [...this.discardPile];
      this.discardPile = [];
      // デッキをシャッフル
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }
    if (this.deck.length > 0) {
      const card = this.deck.pop()!;
      this.hand.push(card);
    }
  }

  addStatus(effect: StatusEffectType, duration: number): void {
    const statusEffect: IStatusEffect = {
      type: effect,
      name: effect,
      duration: duration,
      description: `${effect}効果`,
      value: 1
    };
    this.statusEffects.push(statusEffect);
  }

  removeStatus(effect: StatusEffectType): void {
    this.statusEffects = this.statusEffects.filter(s => s.type !== effect);
  }

  updateStatuses(): void {
    this.statusEffects = this.statusEffects.filter(effect => {
      effect.duration--;
      return effect.duration > 0;
    });
  }

  takeDamage(amount: number): void {
    this.hp -= Math.floor(amount * this.damageReceivedMultiplier);
  }

  heal(amount: number): void {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  spendMp(amount: number): void {
    this.mp -= Math.floor(amount * this.mpCostMultiplier);
  }

  gainMp(amount: number): void {
    this.mp = Math.min(this.mp + amount, this.maxMp);
  }

  spendFaith(amount: number): void {
    this.faith -= amount;
  }

  addFaith(amount: number): void {
    this.faith += amount;
  }

  addCombo(amount: number): void {
    this.combo = Math.min(this.combo + amount, this.maxCombo);
  }

  resetCombo(): void {
    this.combo = 0;
  }
}

export class GameService {
  private gameState: IGameState;
  private gameId: string;

  constructor() {
    this.gameId = crypto.randomUUID();
    const humanPlayer = new Player('human', 'プレイヤー');
    const aiPlayer = new Player('ai', 'AI');

    this.gameState = {
      id: this.gameId,
      currentTurn: 1,
      currentPlayerId: 'human',
      players: [humanPlayer, aiPlayer],
      weather: { type: 'SUNNY' as WeatherKind, duration: 3 },
      phase: 'MAIN',
      turn: 1
    };
  }

  getGameState(): IGameState {
    return this.gameState;
  }

  startTurn(): void {
    this.gameState.currentPlayerId = 'human';
    const currentPlayer = this.gameState.players.find(p => p.id === this.gameState.currentPlayerId);
    if (currentPlayer) {
      currentPlayer.drawCard();
    }
  }

  endTurn(): void {
    const currentPlayer = this.gameState.players.find(p => p.id === this.gameState.currentPlayerId);
    if (currentPlayer) {
      currentPlayer.updateStatuses();
    }
    this.gameState.turn++;
  }

  processAITurn(): void {
    console.log('AI is thinking...');
    // AIの行動をシミュレート
    const ai = this.gameState.players.find(p => p.id === 'ai');
    if (ai && ai.hand.length > 0) {
      this.playCard('ai', 0, 'human');
    }
  }

  playCard(playerId: string, cardIndex: number, targetId: string): boolean {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player || cardIndex >= player.hand.length) return false;

    const card = player.hand[cardIndex];
    if (player.mp < (card.mpCost || 0)) return false;

    // カードを使用
    player.spendMp(card.mpCost || 0);
    const target = this.gameState.players.find(p => p.id === targetId);
    if (target && card.power) {
      target.takeDamage(card.power);
    }
    player.hand.splice(cardIndex, 1);
    player.discardPile.push(card);
    return true;
  }

  isGameOver(): boolean {
    return this.gameState.players.some(p => p.hp <= 0);
  }

  getWinner(): IPlayer | null {
    if (!this.isGameOver()) return null;
    return this.gameState.players.find(p => p.hp > 0) || null;
  }
} 