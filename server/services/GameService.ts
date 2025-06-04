import { IGameState, PlayerData as IPlayerData, IDamageEvent, ICardData, WeatherKind, GamePhase, StatusEffectType, ElementKind, IWeather, CARD_TYPES, STATUS_EFFECTS, WEATHER_TYPES, GAME_PHASES } from '../../shared/types/game';
import { WEATHER_CONFIG } from '../schema/weather';
import { ValidationError, GameError } from '../utils/errors';
import { generateRandomCard } from '../data/cards';

interface IStatusEffectData {
  damage?: number;
  duration: number;
  healReduction?: number;
  blockDefense?: boolean;
  additionalDamage?: number;
  blockTrade?: boolean;
  blockAction?: boolean;
  damageMultiplier?: number;
  blockDamage?: boolean;
  healBonus?: number;
}

const STATUS_EFFECT_CONFIG: Record<StatusEffectType, IStatusEffectData> = {
  BURN: { damage: 50, duration: 3 },
  FREEZE: { blockAction: true, duration: 2 },
  POISON: { damage: 100, duration: 2 },
  STUN: { blockAction: true, duration: 1 },
  SHIELD: { blockDamage: true, duration: 1 },
  REGEN: { healBonus: 0.3, duration: 3 },
  REGENERATION: { healBonus: 0.3, duration: 3 },
  CURSE: { duration: 3, damageMultiplier: 0.5 },
  BLESS: { duration: 2, healBonus: 0.2 },
  RAGE: { duration: 2, damageMultiplier: 2.0 },
  PURIFY: { duration: 3, healReduction: 0.3 },
  PARALYZE: { duration: 1, blockAction: true }
};

// 属性相性表
const ELEMENT_MULTIPLIERS: Record<ElementKind, Record<ElementKind, number>> = {
  FIRE: {
    FIRE: 1,
    WATER: 0.5,
    EARTH: 1,
    WIND: 1.5,
    LIGHT: 1,
    DARK: 1,
    NEUTRAL: 1
  },
  WATER: {
    FIRE: 1.5,
    WATER: 1,
    EARTH: 0.5,
    WIND: 1,
    LIGHT: 1,
    DARK: 1,
    NEUTRAL: 1
  },
  EARTH: {
    FIRE: 1,
    WATER: 1.5,
    EARTH: 1,
    WIND: 0.5,
    LIGHT: 1,
    DARK: 1,
    NEUTRAL: 1
  },
  WIND: {
    FIRE: 0.5,
    WATER: 1,
    EARTH: 1.5,
    WIND: 1,
    LIGHT: 1,
    DARK: 1,
    NEUTRAL: 1
  },
  LIGHT: {
    FIRE: 1,
    WATER: 1,
    EARTH: 1,
    WIND: 1,
    LIGHT: 0.5,
    DARK: 1.5,
    NEUTRAL: 1
  },
  DARK: {
    FIRE: 1,
    WATER: 1,
    EARTH: 1,
    WIND: 1,
    LIGHT: 1.5,
    DARK: 0.5,
    NEUTRAL: 1
  },
  NEUTRAL: {
    FIRE: 1,
    WATER: 1,
    EARTH: 1,
    WIND: 1,
    LIGHT: 1,
    DARK: 1,
    NEUTRAL: 1
  }
};

// 天候効果 - WeatherKind に合わせてキーを修正
const WEATHER_EFFECTS: Record<WeatherKind, (state: IGameState) => void> = {
  CLEAR: () => {},
  RAINY: (state: IGameState) => {
    state.players.forEach(player => {
      player.hand.forEach(card => {
        if (card.element === 'WATER') card.power = card.power ? card.power * 1.2 : 0;
        if (card.element === 'FIRE') card.power = card.power ? card.power * 0.8 : 0;
      });
    });
  },
  STORMY: (state: IGameState) => {
    state.players.forEach(player => {
      player.hand.forEach(card => {
        if (card.element === 'WIND') card.power = card.power ? card.power * 1.3 : 0;
        if (card.element === 'EARTH') card.power = card.power ? card.power * 0.7 : 0;
      });
    });
  },
  SUNNY: (state: IGameState) => {
    state.players.forEach(player => {
      player.hand.forEach(card => {
        if (card.element === 'FIRE') card.power = card.power ? card.power * 1.2 : 0;
        if (card.element === 'WATER') card.power = card.power ? card.power * 0.8 : 0;
      });
    });
  },
  FOGGY: () => {},
  WINDY: () => {},
  SACRED: () => {},
  SNOWY: (state: IGameState) => {
    state.players.forEach(player => {
      player.hand.forEach(card => {
        if (card.element === 'WATER' || card.element === 'EARTH') card.power = card.power ? card.power * 1.2 : 0;
        if (card.element === 'FIRE' || card.element === 'WIND') card.power = card.power ? card.power * 0.8 : 0;
      });
    });
  }
};

export class GameManager {
  private games: Map<string, IGameState> = new Map();
  private readonly PLAYER_INITIAL_HP = 2000;
  private readonly PLAYER_INITIAL_MP = 150;
  private readonly PLAYER_MAX_MP = 300;
  private readonly PLAYER_HAND_SIZE = 5;

  private generateInitialWeather(): IWeather {
    const weatherTypes = WEATHER_TYPES;
    const randomWeatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    return {
      type: randomWeatherType,
      duration: WEATHER_CONFIG[randomWeatherType]?.duration || 3
    };
  }

  createGame(gameId: string): IGameState {
    const game: IGameState = {
      id: gameId,
      players: [],
      currentPlayerId: '',
      turn: 1,
      phase: 'WAIT',
      weather: this.generateInitialWeather(),
      currentTurn: 1
    };
    this.games.set(gameId, game);
    return game;
  }

  addPlayer(gameId: string, playerId: string, name: string): IPlayerData {
    const game = this.getGame(gameId);
    if (!game) throw new GameError('GAME_NOT_FOUND', 'Game not found');

    const player: IPlayerData = {
      id: playerId,
      name,
      hp: this.PLAYER_INITIAL_HP,
      maxHp: this.PLAYER_INITIAL_HP,
      mp: this.PLAYER_INITIAL_MP,
      maxMp: this.PLAYER_MAX_MP,
      gold: 0,
      faith: 0,
      maxFaith: 100,
      combo: 0,
      maxCombo: 0,
      hand: [],
      deck: [],
      discardPile: [],
      statusEffects: [],
      status: new Map<StatusEffectType, number>(),
      mpCostMultiplier: 1,
      damageMultiplier: 1,
      damageReceivedMultiplier: 1
    };

    game.players.push(player);
    this.drawInitialHand(player);
    if (game.players.length === 1) {
      game.currentPlayerId = playerId;
    }
    return player;
  }

  executeCardAction(gameId: string, playerId: string, cardIndex: number, targetId?: string): IDamageEvent | null {
    const game = this.getGame(gameId);
    if (!game) throw new GameError('GAME_NOT_FOUND', 'Game not found');

    const player = game.players.find(p => p.id === playerId);
    if (!player) throw new GameError('PLAYER_NOT_FOUND', 'Player not found');

    if (player.status.has('STUN' as StatusEffectType)) {
      throw new GameError('PLAYER_STUNNED', 'Player is stunned');
    }

    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      throw new ValidationError('INVALID_CARD_INDEX', 'Invalid card index');
    }

    const card = player.hand[cardIndex];

    if (card.mpCost && card.mpCost * player.mpCostMultiplier > player.mp) {
      throw new GameError('INSUFFICIENT_MP', 'Not enough MP');
    }

    let damageEvent: IDamageEvent | null = null;

    switch (card.type) {
      case CARD_TYPES[0]:
      case CARD_TYPES[2]:
      case CARD_TYPES[4]:
        if (!targetId) throw new GameError('TARGET_REQUIRED', 'Target is required for these card types');
        damageEvent = this.calculateAndApplyDamage(game, player, card, targetId);
        break;
      case CARD_TYPES[1]:
        this.applyDefenseEffect(game, player, card);
        break;
      case CARD_TYPES[3]:
        this.applySupportEffect(game, player, card, targetId);
        break;
    }

    if (card.mpCost) {
      player.mp = Math.max(0, player.mp - Math.floor(card.mpCost * player.mpCostMultiplier));
    }

    if (card.effects) {
      const target = targetId ? game.players.find(p => p.id === targetId) : player;
      if (target) {
        card.effects.forEach(effect => {
          if (STATUS_EFFECTS.includes(effect)) {
            const effectConfig = STATUS_EFFECT_CONFIG[effect];
            if (effectConfig) {
              target.status.set(effect, effectConfig.duration);
            }
          }
        });
      }
    }

    player.hand.splice(cardIndex, 1);
    player.discardPile.push(card);
    this.drawCards(player, 1);

    if (card.element) {
      if (player.lastPlayedElement === card.element) {
        player.combo = Math.min(player.maxCombo, player.combo + (card.comboValue || 1));
      } else {
        player.combo = card.comboValue || 0;
      }
      player.lastPlayedElement = card.element;
    }

    const weatherEffect = WEATHER_EFFECTS[game.weather.type];
    if (weatherEffect) {
      weatherEffect(game);
    }

    this.checkGameEnd(game);

    return damageEvent;
  }

  private checkGameEnd(game: IGameState): void {
    const alivePlayers = game.players.filter(p => p.hp > 0);
    if (alivePlayers.length <= 1 && game.players.length > 1) {
      game.winner = alivePlayers[0]?.id;
      game.phase = 'END';
    }
  }

  private calculateAndApplyDamage(game: IGameState, player: IPlayerData, card: ICardData, targetId: string): IDamageEvent {
    const target = game.players.find(p => p.id === targetId);
    if (!target) throw new GameError('TARGET_NOT_FOUND', 'Target player not found');
    if (!card.power) throw new GameError('CARD_NO_POWER', 'Card has no power to calculate damage');

    let baseDamage = card.power;

    const elementMultiplier = ELEMENT_MULTIPLIERS[card.element]?.[target.lastPlayedElement || 'NEUTRAL'] || 1;
    baseDamage *= elementMultiplier;

    const weatherConfig = WEATHER_CONFIG[game.weather.type];
    if (weatherConfig) {
      if (weatherConfig.bonus[card.element]) baseDamage *= 1.5;
      if (weatherConfig.penalty[card.element]) baseDamage *= 0.5;
    }
    
    if (card.faithCost && player.faith >= card.faithCost) {
      baseDamage += player.faith * 0.1;
      player.faith -= card.faithCost;
    }

    baseDamage *= (1 + player.combo * 0.1);

    const finalDamage = Math.floor(baseDamage * player.damageMultiplier * target.damageReceivedMultiplier);

    target.hp = Math.max(0, target.hp - finalDamage);

    const damageEvent: IDamageEvent = {
      sourceId: player.id,
      targetId: target.id,
      amount: finalDamage,
      element: card.element,
      isCritical: player.combo >= player.maxCombo,
    };

    return damageEvent;
  }

  private applyDefenseEffect(game: IGameState, player: IPlayerData, card: ICardData): void {
    if (card.shield) {
      const shieldDuration = card.effects?.find(e => e === 'SHIELD') ? STATUS_EFFECT_CONFIG['SHIELD'].duration : 1;
      player.status.set('SHIELD' as StatusEffectType, shieldDuration);
    }
  }

  private applySupportEffect(game: IGameState, player: IPlayerData, card: ICardData, targetId?: string): void {
    const target = targetId ? game.players.find(p => p.id === targetId) : player;
    if (!target) return;

    if (card.effects) {
      card.effects.forEach(effect => {
        if (STATUS_EFFECTS.includes(effect)) {
          const effectConfig = STATUS_EFFECT_CONFIG[effect];
          if (effectConfig) {
            if (effect === 'REGENERATION' || effect === 'REGEN') {
              target.hp = Math.min(target.maxHp, target.hp + (effectConfig.healBonus ? target.maxHp * effectConfig.healBonus : 50));
            }
            target.status.set(effect, effectConfig.duration);
          }
        }
      });
    }
    if (card.name === "MPポーション") {
      target.mp = Math.min(target.maxMp, target.mp + 50);
    }
  }

  private drawInitialHand(player: IPlayerData): void {
    if (player.deck.length === 0) {
      for (let i = 0; i < 30; i++) player.deck.push(generateRandomCard());
      player.deck = this.shuffleDeck(player.deck);
    }
    this.drawCards(player, this.PLAYER_HAND_SIZE);
  }

  private shuffleDeck(deck: ICardData[]): ICardData[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private drawCards(player: IPlayerData, count: number): void {
    for (let i = 0; i < count; i++) {
      if (player.deck.length === 0) {
        if (player.discardPile.length === 0) break;
        player.deck = this.shuffleDeck([...player.discardPile]);
        player.discardPile = [];
      }
      const card = player.deck.pop();
      if (card && player.hand.length < 7) {
        player.hand.push(card);
      } else if (card) {
        player.discardPile.push(card);
      }
    }
  }

  getGame(gameId: string): IGameState | undefined {
    return this.games.get(gameId);
  }

  startTurn(gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) return;
    if (!this.isValidPhaseTransition(game.phase, ['WAIT', 'DRAW', 'MAIN'])) return;
    
    const currentPlayer = game.players.find(p => p.id === game.currentPlayerId);
    if (!currentPlayer) return;

    this.updateStatusEffects(currentPlayer, 'START');

    currentPlayer.mp = Math.min(currentPlayer.maxMp, currentPlayer.mp + 10);
    this.drawCards(currentPlayer, 1);
    
    // フェーズ遷移
    game.phase = this.getNextPhase(game.phase);
  }

  private updateStatusEffects(player: IPlayerData, phase: 'START' | 'END'): void {
    const effectsToRemove: StatusEffectType[] = [];
    player.status.forEach((duration, effect) => {
      const effectConfig = STATUS_EFFECT_CONFIG[effect];
      if (!effectConfig) return;

      if (phase === 'END') {
        if (effect === 'BURN') player.hp = Math.max(0, player.hp - (effectConfig.damage || 0));
        if (effect === 'POISON') player.hp = Math.max(0, player.hp - (effectConfig.damage || 0));
      } else if (phase === 'START') {
        if (effect === 'REGEN' || effect === 'REGENERATION') player.hp = Math.min(player.maxHp, player.hp + (effectConfig.healBonus ? player.maxHp * effectConfig.healBonus : 0));
      }

      if (duration - 1 <= 0) {
        effectsToRemove.push(effect);
      } else {
        player.status.set(effect, duration - 1);
      }
    });
    effectsToRemove.forEach(effect => player.status.delete(effect));
    this.checkGameEnd(this.games.get(player.id)!);
  }

  endTurn(gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) return;
    if (!this.isValidPhaseTransition(game.phase, ['MAIN'])) return;

    const currentPlayer = game.players.find(p => p.id === game.currentPlayerId);
    if (!currentPlayer) return;
    
    this.updateStatusEffects(currentPlayer, 'END');
    this.checkGameEnd(game);
    
    if (game.phase === 'END') {
      game.phase = 'FINISHED';
      return;
    }

    game.weather.duration--;
    if (game.weather.duration <= 0) {
      game.weather = this.generateInitialWeather();
    }

    const currentIndex = game.players.findIndex(p => p.id === game.currentPlayerId);
    const nextPlayerIndex = (currentIndex + 1) % game.players.length;
    game.currentPlayerId = game.players[nextPlayerIndex].id;
    game.currentTurn++;
    
    game.phase = 'WAIT';
    this.startTurn(gameId);
  }

  private isValidPhaseTransition(currentPhase: GamePhase, allowedPhases: GamePhase[]): boolean {
    return allowedPhases.includes(currentPhase);
  }

  private getNextPhase(currentPhase: GamePhase): GamePhase {
    switch (currentPhase) {
      case 'WAIT':
        return 'DRAW';
      case 'DRAW':
        return 'MAIN';
      case 'MAIN':
        return 'WAIT';
      case 'END':
        return 'FINISHED';
      default:
        return currentPhase;
    }
  }

  isGameOver(gameId: string): boolean {
    const game = this.getGame(gameId);
    return !!game && (game.phase === 'END' || game.phase === 'FINISHED');
  }

  getWinner(gameId: string): IPlayerData | null {
    const game = this.getGame(gameId);
    if (!game || !this.isGameOver(gameId) || !game.winner) return null;
    return game.players.find(p => p.id === game.winner) || null;
  }
}

export const gameManager = new GameManager();