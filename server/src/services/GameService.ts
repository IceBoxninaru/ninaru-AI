import { IGameState, IPlayer, ICardData, WeatherKind, ElementKind, StatusEffectType, WEATHER_TYPES, GamePhase } from '../../../shared/types/game.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { calculateDamage } from '../../../shared/utils/gameUtils.js';
import { logger } from '../utils/logger.js';

export class GameService {
  private games: Map<string, IGameState> = new Map();

  createGame(): string {
    const gameId = crypto.randomUUID();
    const initialState: IGameState = {
      id: gameId,
      currentTurn: 1,
      currentPlayerId: '',
      players: [],
      weather: { type: WeatherKind.CLEAR, duration: 3 },
      phase: GamePhase.WAIT
    };

    this.games.set(gameId, initialState);
    logger.info(`Game created: ${gameId}`);
    return gameId;
  }

  getGameState(): IGameState[] {
    return Array.from(this.games.values());
  }

  getGameById(gameId: string): IGameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundError(`Game not found: ${gameId}`);
    }
    return game;
  }

  private getGame(gameId: string): IGameState {
    const game = this.games.get(gameId);
    if (!game) {
      throw new NotFoundError(`Game not found: ${gameId}`);
    }
    return game;
  }

  joinGame(gameId: string, playerId: string, playerName: string): void {
    const game = this.getGame(gameId);
    
    if (game.players.length >= 2) {
      throw new ValidationError('Game is full');
    }

    const player: IPlayer = {
      id: playerId,
      name: playerName,
      hp: 2000,
      maxHp: 2000,
      mp: 100,
      maxMp: 100,
      faith: 0,
      maxFaith: 100,
      combo: 0,
      maxCombo: 0,
      gold: 1000,
      hand: [],
      deck: [],
      discardPile: [],
      statusEffects: [],
      status: new Map(),
      damageMultiplier: 1,
      mpCostMultiplier: 1,
      damageReceivedMultiplier: 1,
      team: 1,
      drawCard: () => {},
      playCard: (cardIndex: string) => null,
      canPlayCard: () => true,
      takeDamage: () => {},
      heal: () => {},
      gainMp: () => {},
      spendMp: () => {},
      addFaith: () => {},
      spendFaith: () => {},
      addCombo: () => {},
      resetCombo: () => {},
      isCriticalHit: () => false,
      addStatus: () => {},
      removeStatus: () => {},
      hasStatusEffect: () => false,
      updateStatuses: () => {},
      isAlive: () => true,
      resetForNewGame: () => {},
      lastPlayedElement: undefined as ElementKind | undefined
    };

    game.players.push(player);
    
    if (game.players.length === 2) {
      game.phase = GamePhase.DRAW;
      game.currentPlayerId = game.players[0].id;
    }

    this.games.set(gameId, game);
    logger.info(`Player ${player.id} joined game ${gameId}`);
  }

  playCard(gameId: string, playerId: string, targetId: string, cardIndex: string): void {
    const game = this.getGame(gameId);
    
    if (game.currentPlayerId !== playerId) {
      throw new ValidationError('Not your turn');
    }

    const player = this.getPlayer(game, playerId);
    const opponent = targetId ? this.getPlayer(game, targetId) : game.players.find(p => p.id !== playerId);

    if (!opponent) {
      throw new ValidationError('Opponent not found');
    }

    if (player.statusEffects.some(effect => effect.type === StatusEffectType.STUN)) {
      throw new ValidationError('Player is stunned');
    }

    const card = player.hand[Number(cardIndex)];
    if (!card) {
      throw new ValidationError('Card not found');
    }

    // コンボ要件のチェック
    if (card.requirements?.minCombo && player.combo < card.requirements.minCombo) {
      throw new ValidationError(`Requires ${card.requirements.minCombo} combo to play this card`);
    }

    if (card.mpCost > player.mp) {
      throw new ValidationError('Not enough MP');
    }

    // コンボシステムの処理
    if (card.element && card.element === player.lastPlayedElement) {
      player.combo++;
    } else {
      player.combo = 0;
    }
    player.lastPlayedElement = card.element;

    // カードの効果を適用
    this.applyCardEffect(game, player, opponent, card);

    // 状態を更新
    player.mp -= card.mpCost;
    player.hand.splice(Number(cardIndex), 1);
    player.discardPile.push(card);
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

  private getPlayer(game: IGameState, playerId: string): IPlayer {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundError(`Player not found: ${playerId}`);
    }
    return player;
  }

  private applyCardEffect(game: IGameState, player: IPlayer, opponent: IPlayer, card: ICardData): void {
    if (card.power) {
      let damage = calculateDamage(
        card.power,
        player,
        opponent,
        card.element || ElementKind.NEUTRAL,
        game.weather
      );

      // コンボボーナスの適用（2コンボごとに10%ダメージ増加）
      if (player.combo > 0) {
        const comboBonus = 1 + (Math.floor(player.combo / 2) * 0.1);
        damage = Math.floor(damage * comboBonus);
      }

      opponent.hp -= damage;
    }

    if (card.shield) {
      // シールド効果を付与
      player.statusEffects.push({ type: StatusEffectType.SHIELD, duration: 1 });
      // HPを回復（シールド値の半分）
      const healAmount = Math.floor(card.shield / 2);
      // コンボボーナスの適用（2コンボごとに10%回復量増加）
      if (player.combo > 0) {
        const comboBonus = 1 + (Math.floor(player.combo / 2) * 0.1);
        const finalHealAmount = Math.floor(healAmount * comboBonus);
        player.hp = Math.min(player.hp + finalHealAmount, player.maxHp);
      } else {
        player.hp = Math.min(player.hp + healAmount, player.maxHp);
      }
    }

    if (card.effects) {
      card.effects.forEach(effect => {
        let duration = 2;
        // コンボボーナスの適用（2コンボごとに1ターン延長）
        if (player.combo > 0) {
          duration += Math.floor(player.combo / 2);
        }
        opponent.statusEffects.push({ type: effect, duration });
      });
    }
  }

  private applyStatusEffects(game: IGameState): void {
    game.players.forEach(player => {
      player.statusEffects = player.statusEffects.filter(effect => {
        switch (effect.type) {
          case StatusEffectType.POISON:
            player.hp -= 5;
            break;
          case StatusEffectType.BURN:
            player.hp -= 3;
            break;
          case StatusEffectType.REGENERATION:
            player.hp = Math.min(player.hp + 5, player.maxHp);
            break;
        }
        
        if (effect.duration) {
          effect.duration--;
          return effect.duration > 0;
        }
        return false;
      });
    });
  }

  private updateWeather(game: IGameState): void {
    // 120ターン以降は天罰天候
    if (game.currentTurn >= 120) {
      game.weather = {
        type: WeatherKind.SACRED,
        duration: 999 // 永続的
      };
      return;
    }

    // 通常の天候更新
    game.weather.duration--;
    if (game.weather.duration <= 0) {
      game.weather = {
        type: WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)],
        duration: 3
      };
    }
  }
} 