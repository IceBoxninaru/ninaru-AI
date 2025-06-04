import { IGameState, IPlayer, ICardData, WeatherKind, ElementKind, StatusEffectType, WEATHER_TYPES } from '../../../shared/types/game';
import { ValidationError, NotFoundError } from '../utils/errors';
import { calculateDamage } from '../../../shared/utils/gameUtils';
import { logger } from '../utils/logger';

export class GameService {
  private games: Map<string, IGameState> = new Map();

  createGame(): string {
    const gameId = crypto.randomUUID();
    const initialState: IGameState = {
      id: gameId,
      currentTurn: 1,
      currentPlayerId: '',
      players: [],
      weather: { type: 'CLEAR' as WeatherKind, duration: 3 },
      phase: 'WAIT',
      turn: 1
    };

    this.games.set(gameId, initialState);
    logger.info(`Game created: ${gameId}`);
    return gameId;
  }

  joinGame(gameId: string, player: IPlayer): void {
    const game = this.getGame(gameId);
    
    if (game.players.length >= 2) {
      throw new ValidationError('Game is full');
    }

    game.players.push(player);
    
    if (game.players.length === 2) {
      game.phase = 'DRAW';
      game.currentPlayerId = game.players[0].id;
    }

    this.games.set(gameId, game);
    logger.info(`Player ${player.id} joined game ${gameId}`);
  }

  playCard(gameId: string, playerId: string, card: ICardData): void {
    const game = this.getGame(gameId);
    
    if (game.currentPlayerId !== playerId) {
      throw new ValidationError('Not your turn');
    }

    const player = this.getPlayer(game, playerId);
    const opponent = game.players.find(p => p.id !== playerId);

    if (!opponent) {
      throw new ValidationError('Opponent not found');
    }

    if (card.mpCost > player.mp) {
      throw new ValidationError('Not enough MP');
    }

    // カードの効果を適用
    this.applyCardEffect(game, player, opponent, card);

    // 状態を更新
    player.mp -= card.mpCost;
    this.games.set(gameId, game);

    logger.info(`Card played: ${card.id} by player ${playerId} in game ${gameId}`);
  }

  endTurn(gameId: string): void {
    const game = this.getGame(gameId);
    
    // ターン終了時の処理
    this.applyStatusEffects(game);
    this.updateWeather(game);
    
    // 次のプレイヤーのターンへ
    const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
    game.currentPlayerId = game.players[nextPlayerIndex].id;
    game.currentTurn++;

    this.games.set(gameId, game);
    logger.info(`Turn ended in game ${gameId}`);
  }

  private getGame(gameId: string): IGameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundError(`Game not found: ${gameId}`);
    }
    return game;
  }

  private getPlayer(game: IGameState, playerId: string): IPlayer {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundError(`Player not found: ${playerId}`);
    }
    return player;
  }

  private applyCardEffect(game: IGameState, player: IPlayer, opponent: IPlayer, card: ICardData): void {
    if (card.power) {
      const damage = calculateDamage(card.power, player, opponent, card.element, game.weather);
      opponent.hp -= damage;
    }

    if (card.shield) {
      player.statusEffects.push({ type: 'SHIELD', turnsLeft: 1 });
    }

    if (card.effects) {
      card.effects.forEach(effect => {
        opponent.statusEffects.push({ type: effect, turnsLeft: 2 });
      });
    }
  }

  private applyStatusEffects(game: IGameState): void {
    game.players.forEach(player => {
      player.statusEffects = player.statusEffects.filter(effect => {
        switch (effect.type) {
          case 'POISON':
            player.hp -= 5;
            break;
          case 'BURN':
            player.hp -= 3;
            break;
          case 'REGENERATION':
            player.hp = Math.min(player.hp + 5, player.maxHp);
            break;
        }
        
        effect.turnsLeft--;
        return effect.turnsLeft > 0;
      });
    });
  }

  private updateWeather(game: IGameState): void {
    game.weather.duration--;
    if (game.weather.duration <= 0) {
      game.weather = {
        type: WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)],
        duration: 3
      };
    }
  }
} 