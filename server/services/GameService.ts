import { IGameState, IPlayer, ICardData, WeatherKind, ElementKind, StatusEffectType, GamePhase } from '../../shared/types/game.js';
import { ValidationError, GameError } from '../utils/errors.js';
import { generateRandomCard } from '../data/cards.js';
import { Player } from '../src/models/Player.js';
import { randomUUID } from 'crypto';

export class GameService {
  private games: Map<string, IGameState> = new Map();

  createGame(): string {
    const gameId = randomUUID();
    const initialState: IGameState = {
      id: gameId,
      currentTurn: 1,
      currentPlayerId: '',
      players: [],
      weather: { type: WeatherKind.CLEAR, duration: 3 },
      phase: GamePhase.WAIT
    };

    this.games.set(gameId, initialState);
    return gameId;
  }

  getGameState(): IGameState {
    // テスト用のダミー実装
    const player1 = new Player('player1', 'Player 1');
    const player2 = new Player('player2', 'Player 2');
    return {
      id: 'test',
      currentTurn: 1,
      currentPlayerId: player1.id,
      players: [player1, player2],
      weather: { type: WeatherKind.CLEAR, duration: 3 },
      phase: GamePhase.WAIT
    };
  }

  private getGame(gameId: string): IGameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new GameError('GAME_NOT_FOUND', 'Game not found');
    }
    return game;
  }

  joinGame(gameId: string, playerId: string, playerName: string): void {
    const game = this.getGame(gameId);
    if (game.players.length >= 2) {
      throw new ValidationError('Game is full');
    }

    const player = new Player(playerId, playerName);
    game.players.push(player);

    if (game.players.length === 2) {
      game.phase = GamePhase.DRAW;
      game.currentPlayerId = game.players[0].id;
    }

    this.games.set(gameId, game);
  }

  playCard(gameId: string, playerId: string, cardIndex: number, targetId?: string): void {
    const game = this.getGame(gameId);
    const player = this.getPlayer(game, playerId);
    const target = targetId ? this.getPlayer(game, targetId) : player;

    const card = player.playCard(cardIndex);
    if (!card) {
      throw new ValidationError('Invalid card index');
    }

    if (!player.canPlayCard(card)) {
      throw new ValidationError('Cannot play this card');
    }

    this.applyCardEffect(game, player, target, card);
    player.spendMp(card.mpCost);
  }

  private getPlayer(game: IGameState, playerId: string): IPlayer {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new GameError('PLAYER_NOT_FOUND', 'Player not found');
    }
    return player;
  }

  private applyCardEffect(game: IGameState, player: IPlayer, target: IPlayer, card: ICardData): void {
    if (card.power) {
      const damage = this.calculateDamage(
        card.power,
        player,
        target,
        card.element || ElementKind.NEUTRAL,
        game.weather
      );
      target.takeDamage(damage);
    }

    if (card.shield) {
      player.addStatus(StatusEffectType.SHIELD, 1);
    }

    if (card.effects) {
      card.effects.forEach(effect => {
        target.addStatus(effect, 2);
      });
    }
  }

  private calculateDamage(power: number, attacker: IPlayer, defender: IPlayer, element: ElementKind, weather: { type: WeatherKind }): number {
    let damage = power * attacker.damageMultiplier * defender.damageReceivedMultiplier;

    if (attacker.isCriticalHit()) {
      damage *= 1.5;
    }

    return Math.floor(damage);
  }

  endTurn(gameId: string): void {
    const game = this.getGame(gameId);
    const currentPlayer = this.getPlayer(game, game.currentPlayerId);

    currentPlayer.updateStatuses();

    const currentIndex = game.players.findIndex(p => p.id === game.currentPlayerId);
    const nextPlayerIndex = (currentIndex + 1) % game.players.length;
    game.currentPlayerId = game.players[nextPlayerIndex].id;
    game.currentTurn++;

    game.weather.duration--;
    if (game.weather.duration <= 0) {
      game.weather = {
        type: WeatherKind.CLEAR,
        duration: 3
      };
    }
  }
}