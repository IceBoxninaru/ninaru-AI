import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  IGameState,
  IPlayer as PlayerData,
  ICardData,
  WeatherKind,
  GamePhase,
  StatusEffectType,
  ElementKind,
  IWeather
} from '../../shared/types/game';
import { WEATHER_CONFIG, STATUS_EFFECT_CONFIG } from '../schema/weather';
import { generateRandomCard } from '../data/cards';

export class GameManager {
  private games: Map<string, IGameState> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public createGame(players: string[]): string {
    const gameId = uuidv4();
    const initialWeather = this.generateInitialWeather();
    const initialState: IGameState = {
      id: gameId,
      players: players.map(playerId => this.createPlayer(playerId)),
      currentPlayerId: players[0],
      currentTurn: 1,
      turn: 1,
      weather: initialWeather,
      phase: 'DRAW'
    };

    this.games.set(gameId, initialState);
    return gameId;
  }

  private createPlayer(id: string): PlayerData {
    const deck = this.generateInitialDeck();
    const hand = deck.splice(0, 5);  // 最初の5枚を手札に加える
    
    return {
      id,
      name: `Player ${id}`,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      gold: 0,
      faith: 0,
      maxFaith: 100,
      combo: 0,
      maxCombo: 5,
      hand,
      deck,
      discardPile: [],
      statusEffects: [],
      status: new Map<StatusEffectType, number>(),
      mpCostMultiplier: 1,
      damageMultiplier: 1,
      damageReceivedMultiplier: 1
    };
  }

  private generateInitialDeck(): ICardData[] {
    const deck: ICardData[] = [];
    for (let i = 0; i < 30; i++) {  // 30枚のデッキを生成
      deck.push(generateRandomCard());
    }
    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: ICardData[]): ICardData[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  public playCard(gameId: string, playerId: string, cardIndex: number, targetId?: string): void {
    const game = this.games.get(gameId);
    if (!game) return;

    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1 || game.currentPlayerId !== playerId) return;

    const player = game.players[playerIndex];
    const card = player.hand[cardIndex];
    if (!card || player.mp < card.mpCost) return;

    // カードの効果を適用
    this.applyCardEffect(game, player, card, targetId);

    // 手札から削除
    player.hand.splice(cardIndex, 1);
    player.discardPile.push(card);
    player.mp -= card.mpCost;

    // ゲーム状態の更新
    this.updateGameState(game);
    this.broadcastGameState(gameId);
  }

  private applyCardEffect(game: IGameState, player: PlayerData, card: ICardData, targetId?: string): void {
    const target = targetId ? game.players.find(p => p.id === targetId) : player;
    if (!target) return;

    if (Array.isArray(card.effects)) {
      card.effects.forEach(effect => {
        if (effect && typeof effect === 'string') {
          target.statusEffects.push({ type: effect as StatusEffectType, turnsLeft: 2 });
        }
      });
    }

    if (card.power && typeof card.power === 'number') {
      this.dealDamage(target, Math.floor(card.power * player.damageMultiplier));
    }

    if (card.shield && typeof card.shield === 'number') {
      target.statusEffects.push({ type: 'SHIELD' as StatusEffectType, turnsLeft: 2 });
    }

    if (typeof card.mpCost === 'number') {
      player.mp = Math.max(0, player.mp - card.mpCost);
    }
  }

  private calculateDamage(baseDamage: number, element: ElementKind, weather: WeatherKind): number {
    let damage = baseDamage;
    const weatherConfig = WEATHER_CONFIG[weather];
    const effectType = weatherConfig.effect; // This is StatusEffectType | undefined

    if (effectType) {
      // Runtime check to ensure the key exists on the object
      if (Object.prototype.hasOwnProperty.call(STATUS_EFFECT_CONFIG, effectType)) {
        // If the key exists, we can access it.
        // Using 'as any' to bypass strict type checking here after runtime check,
        // as TypeScript's inferred type for STATUS_EFFECT_CONFIG might be incomplete.
        const specificEffectConfig = (STATUS_EFFECT_CONFIG as any)[effectType];

        // WARNING: This logic is highly questionable.
        // The names '強化' or '弱体' are unlikely to match actual names in STATUS_EFFECT_CONFIG (e.g., '炎上', '毒').
        // This means these conditions will likely always be false.
        if (specificEffectConfig && typeof specificEffectConfig.name === 'string') {
          if (specificEffectConfig.name === '強化') {
            damage += 2;
          } else if (specificEffectConfig.name === '弱体') {
            damage -= 1;
          }
        }
      }
    }
    return Math.max(0, damage);
  }

  private dealDamage(target: PlayerData, amount: number): void {
    if (target && typeof amount === 'number') {
      target.hp = Math.max(0, target.hp - Math.floor(amount));
    }
  }

  private updateGameState(game: IGameState): void {
    // 勝利条件チェック
    const alivePlayers = game.players.filter(p => p.hp > 0);
    if (alivePlayers.length === 1) {
      game.winner = alivePlayers[0].id;
      return;
    }

    // ターン終了処理
    if (game.phase === 'END') {
      this.endTurn(game);
    }
  }

  private endTurn(game: IGameState): void {
    // 状態異常の処理
    game.players.forEach(player => {
      player.status.forEach((duration, effect) => {
        if (effect === 'BURN') {
          this.dealDamage(player, 2);
        } else if (effect === 'POISON') {
          this.dealDamage(player, 1);
        }
        
        if (duration > 1) {
          player.status.set(effect, duration - 1);
        } else {
          player.status.delete(effect);
        }
      });
    });

    // 次のプレイヤーへ
    const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
    game.currentPlayerId = game.players[nextPlayerIndex].id;
    
    if (nextPlayerIndex === 0) { // 最初のプレイヤーに戻ったらターンを進める
      game.currentTurn += 1;
      this.updateWeather(game);
    }

    // 新しいターンの開始
    const nextPlayer = game.players[nextPlayerIndex];
    nextPlayer.mp = Math.min(nextPlayer.maxMp, nextPlayer.mp + 2);
    game.phase = 'DRAW';
  }

  private updateWeather(game: IGameState): void {
    const weatherTypes: WeatherKind[] = ['SUNNY', 'RAINY', 'WINDY', 'STORMY', 'SACRED', 'FOGGY', 'CLEAR'];
    const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)] as WeatherKind;
    game.weather = {
      type: newWeather,
      duration: 3
    };
  }

  private broadcastGameState(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      this.io.to(gameId).emit('gameStateUpdate', game);
    }
  }

  public drawCard(gameId: string, playerId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    if (player.deck.length === 0) {
      // デッキが空の場合、捨て札をシャッフルしてデッキに戻す
      player.deck = this.shuffleDeck([...player.discardPile]);
      player.discardPile = [];
    }

    if (player.deck.length > 0) {
      const card = player.deck.pop();
      if (card) {
        player.hand.push(card);
      }
    }

    this.broadcastGameState(gameId);
  }

  private generateInitialWeather(): IWeather {
    const weatherTypes: WeatherKind[] = ['SUNNY', 'RAINY', 'WINDY', 'STORMY', 'SACRED', 'FOGGY', 'CLEAR'];
    const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)] as WeatherKind;
    return {
      type: newWeather,
      duration: 3
    };
  }
} 