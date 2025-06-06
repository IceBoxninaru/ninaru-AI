import { IGameState, IPlayer, ICardData, WeatherKind, StatusEffectType, ElementKind, IStatusEffect, GamePhase } from '../../../shared/types/game.js';
import { Player } from '../models/Player.js';
import { randomUUID } from 'crypto';

export class GameService {
  private gameState: IGameState;
  private gameId: string;

  constructor() {
    this.gameId = randomUUID();
    const humanPlayer = new Player('human', 'プレイヤー');
    const aiPlayer = new Player('ai', 'AI');

    this.gameState = {
      id: this.gameId,
      currentTurn: 1,
      currentPlayerId: 'human',
      players: [humanPlayer, aiPlayer],
      weather: { type: WeatherKind.CLEAR, duration: 3 },
      phase: GamePhase.MAIN
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
    this.gameState.currentTurn++;
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