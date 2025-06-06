import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  IGameState,
  IPlayer,
  ICardData,
  IWeather,
  WeatherKind,
  GamePhase,
  StatusEffectType,
  ElementKind,
  IDamageEvent,
  IGameEvent,
  DEFAULT_GAME_CONFIG,
  CardType
} from '../../shared/types/game.js';
import { Player } from './models/Player.js';
import {
  WEATHER_CONFIG,
  generateRandomWeather,
  generateDifferentWeather,
  calculateWeatherModifier,
  checkWeatherStatusEffect,
  updateWeatherDuration,
  STATUS_EFFECT_CONFIG
} from '../schema/weather.js';

export class Game {
  private state: IGameState;
  private io?: Server;
  private gameEvents: IGameEvent[] = [];
  private turnTimer?: NodeJS.Timeout;
  private readonly TURN_TIME_LIMIT = 60000; // 60秒
  private sockets: Map<string, Socket> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.state = {
      id: uuidv4(),
      currentTurn: 1,
      currentPlayerId: '',
      players: [],
      weather: this.generateInitialWeather(),
      phase: GamePhase.WAIT,
      maxPlayers: DEFAULT_GAME_CONFIG.maxPlayers,
      gameMode: 'STANDARD'
    };
  }

  // ===== GAME INITIALIZATION =====

  /**
   * プレイヤーをゲームに追加する
   */
  addPlayer(socket: Socket, playerName: string): boolean {
    const playerId = socket.id;
    
    if (this.state.players.length >= (this.state.maxPlayers || 4)) {
      return false; // ゲームが満員
    }

    if (this.state.players.some(p => p.id === playerId)) {
      return false; // プレイヤーが既に存在
    }

    const player = new Player(playerId, playerName);
    this.state.players.push(player);
    this.sockets.set(playerId, socket);

    // 最初のプレイヤーがゲームを開始
    if (this.state.players.length === 1) {
      this.state.currentPlayerId = playerId;
      this.state.phase = GamePhase.DRAW;
    }

    this.logGameEvent('PLAYER_JOIN', playerId, undefined, { playerName });
    this.broadcastGameState();
    return true;
  }

  /**
   * プレイヤーをゲームから削除する
   */
  removePlayer(playerId: string): boolean {
    const playerIndex = this.state.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return false;
    }

    this.state.players.splice(playerIndex, 1);
    
    // 現在のプレイヤーが削除された場合、次のプレイヤーに移る
    if (this.state.currentPlayerId === playerId && this.state.players.length > 0) {
      const nextPlayerIndex = playerIndex % this.state.players.length;
      this.state.currentPlayerId = this.state.players[nextPlayerIndex].id;
    }

    this.logGameEvent('PLAYER_LEAVE', playerId);
    this.checkGameEnd();
    this.broadcastGameState();
    return true;
  }

  /**
   * ゲームを開始する
   */
  startGame(): boolean {
    if (this.state.players.length < 2) {
      return false; // 最低2人必要
    }

    if (this.state.phase !== GamePhase.WAIT) {
      return false; // 既に開始済み
    }

    this.state.phase = GamePhase.DRAW;
    this.state.currentTurn = 1;
    
    // 各プレイヤーの初期化
    this.state.players.forEach(player => {
      player.resetForNewGame();
    });

    this.logGameEvent('GAME_START');
    this.startTurn();
    return true;
  }

  public start(): void {
    if (this.state.players.length < 2) {
      throw new Error('ゲームを開始するには2人以上のプレイヤーが必要です。');
    }

    this.state.phase = GamePhase.MAIN;
    this.state.currentPlayerId = this.state.players[0].id;
    this.state.currentTurn = 1;

    // 各プレイヤーの初期化（デッキ生成、シャッフル、初期手札配りを含む）
    this.state.players.forEach(player => {
      player.resetForNewGame();
    });

    this.broadcastGameState();
  }

  // ===== TURN MANAGEMENT =====

  /**
   * ターンを開始する
   */
  private startTurn(): void {
    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer) return;

    // MP回復
    currentPlayer.gainMp(10);

    // 信仰値を少し獲得
    currentPlayer.addFaith(2);

    // カードを引く
    if (currentPlayer.hand.length < 7) { // 最大手札数制限
      currentPlayer.drawCard();
    }

    // ステータス効果の更新（ターン開始時）
    this.processStatusEffectsStart(currentPlayer);

    // 天候効果の適用
    this.applyWeatherEffects(currentPlayer);

    this.state.phase = GamePhase.MAIN;
    
    // ターンタイマーを開始
    this.startTurnTimer();
    
    this.logGameEvent('TURN_START', currentPlayer.id);
    this.broadcastGameState();
  }

  /**
   * ターンを終了する
   */
  public endTurn(playerId: string): void {
    try {
      const player = this.getPlayer(playerId);
      if (!player) {
        throw new Error('プレイヤーが見つかりません。');
      }

      if (this.state.currentPlayerId !== playerId) {
        throw new Error('現在のプレイヤーのターンではありません。');
      }

      // ステータス効果の更新
      player.updateStatuses();

      // MP回復
      player.mp = Math.min(player.maxMp, player.mp + 50);

      // 手札の補充
      while (player.hand.length < 5) {
        player.drawCard();
      }

      // 天候の更新
      this.updateWeather();

      // 次のプレイヤーに移動
      const previousPlayerId = this.state.currentPlayerId;
      this.moveToNextPlayer();

      // ゲーム状態を更新
      this.broadcastGameState();

      // 新しいプレイヤーのターンを開始
      if (this.state.currentPlayerId !== previousPlayerId) {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer) {
          // MP回復
          currentPlayer.gainMp(10);

          // 信仰値を少し獲得
          currentPlayer.addFaith(2);

          // カードを引く
          if (currentPlayer.hand.length < 7) { // 最大手札数制限
            currentPlayer.drawCard();
          }

          // ステータス効果の更新（ターン開始時）
          this.processStatusEffectsStart(currentPlayer);

          // 天候効果の適用
          this.applyWeatherEffects(currentPlayer);

          this.state.phase = GamePhase.MAIN;
          
          // ターンタイマーを開始
          this.startTurnTimer();
          
          this.logGameEvent('TURN_START', currentPlayer.id);
          this.broadcastGameState();
        }
      }
    } catch (error) {
      console.error('Failed to end turn:', error);
      throw error;
    }
  }

  /**
   * 次のプレイヤーに移る
   */
  private moveToNextPlayer(): void {
    const currentPlayerIndex = this.state.players.findIndex(p => p.id === this.state.currentPlayerId);
    let nextPlayerIndex = (currentPlayerIndex + 1) % this.state.players.length;
    
    // 生存しているプレイヤーを探す
    let attempts = 0;
    while (attempts < this.state.players.length) {
      const nextPlayer = this.state.players[nextPlayerIndex];
      if (nextPlayer.isAlive()) {
        this.state.currentPlayerId = nextPlayer.id;
        
        // 全プレイヤーが一巡したらターン数を増加
        if (nextPlayerIndex <= currentPlayerIndex) {
          this.state.currentTurn++;
        }
        return;
      }
      nextPlayerIndex = (nextPlayerIndex + 1) % this.state.players.length;
      attempts++;
    }
  }

  // ===== CARD PLAY SYSTEM =====

  /**
   * カードをプレイする
   */
  playCard(playerId: string, cardIndex: number, targetId?: string): void {
    const player = this.getPlayer(playerId);
    if (!player) {
      throw new Error('プレイヤーが見つかりません。');
    }

    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      throw new Error('不正なカードインデックスです。');
    }

    const card = player.hand[cardIndex];
    if (!card) {
      throw new Error('カードが見つかりません。');
    }

    if (player.mp < card.mpCost) {
      throw new Error('MPが不足しています。');
    }

    if (player.hasStatusEffect(StatusEffectType.STUN)) {
      throw new Error('スタン状態のため、カードをプレイできません。');
    }

    // カードの効果を適用
    this.applyCardEffect(player, card, targetId);

    // カードを手札から削除
    player.hand.splice(cardIndex, 1);
    player.discardPile.push(card);

    // MPを消費
    player.spendMp(card.mpCost);
  }

  /**
   * カードの効果を適用する
   */
  private applyCardEffect(player: IPlayer, card: ICardData, targetId?: string): void {
    const target = targetId ? this.getPlayer(targetId) : this.selectDefaultTarget(player, card);
    
    if (!target) return;

    // ダメージ効果
    if (card.power) {
      this.dealDamage(player, target, card.power, card.element || ElementKind.NEUTRAL);
    }

    // シールド効果
    if (card.shield) {
      // プレイヤー自身に防御効果を適用（通常は）
      player.addStatus(StatusEffectType.SHIELD, 2);
    }

    // ステータス効果
    if (card.effects) {
      card.effects.forEach(effect => {
        const duration = this.getStatusEffectDuration(effect);
        
        // 回復系効果は自分に、攻撃系効果は対象に適用
        if (this.isPositiveEffect(effect)) {
          player.addStatus(effect, duration);
        } else {
          target.addStatus(effect, duration);
        }
      });
    }
  }

  /**
   * デフォルトのターゲットを選択する
   */
  private selectDefaultTarget(player: IPlayer, card: ICardData): IPlayer | null {
    if (card.power && card.power > 0) {
      // 攻撃カードの場合、他のプレイヤーをランダムに選択
      const enemies = this.state.players.filter(p => p.id !== player.id && p.isAlive());
      return enemies.length > 0 ? enemies[Math.floor(Math.random() * enemies.length)] : null;
    }
    
    // その他の場合は自分自身
    return player;
  }

  // ===== DAMAGE SYSTEM =====

  /**
   * ダメージを与える
   */
  private dealDamage(
    attacker: IPlayer, 
    target: IPlayer, 
    baseDamage: number, 
    element: ElementKind
  ): void {
    const damage = this.calculateDamage(baseDamage, attacker, target, element);
    target.hp = Math.max(0, target.hp - damage);

    const damageEvent: IDamageEvent = {
      sourceId: attacker.id,
      targetId: target.id,
      amount: Math.floor(damage),
      element: element,
      isCritical: false,
      timestamp: Date.now()
    };

    this.logGameEvent('DAMAGE', attacker.id, target.id, damageEvent);
    
    if (target.hp <= 0) {
      this.logGameEvent('GAME_END', attacker.id, target.id, { reason: 'defeat' });
      this.checkGameEnd();
    }
  }

  // ===== STATUS EFFECT SYSTEM =====

  /**
   * ターン開始時のステータス効果処理
   */
  private processStatusEffectsStart(player: IPlayer): void {
    // 再生効果の処理
    if (player.hasStatusEffect(StatusEffectType.REGENERATION)) {
      const healAmount = Math.floor(player.maxHp * 0.1);
      player.heal(healAmount);
      this.logGameEvent('HEAL', player.id, player.id, { amount: healAmount, source: 'regeneration' });
    }
  }

  /**
   * ターン終了時のステータス効果処理
   */
  private processStatusEffectsEnd(player: IPlayer): void {
    // 継続ダメージの処理
    if (player.hasStatusEffect(StatusEffectType.BURN)) {
      const damage = Math.floor(player.maxHp * 0.03);
      player.takeDamage(damage);
      this.logGameEvent('DAMAGE', 'burn', player.id, { amount: damage, source: 'burn' });
    }

    if (player.hasStatusEffect(StatusEffectType.POISON)) {
      const damage = Math.floor(player.maxHp * 0.05);
      player.takeDamage(damage);
      this.logGameEvent('DAMAGE', 'poison', player.id, { amount: damage, source: 'poison' });
    }

    // ステータス効果の持続時間を更新
    player.updateStatuses();
  }

  /**
   * ステータス効果の持続時間を取得
   */
  private getStatusEffectDuration(effect: StatusEffectType): number {
    switch (effect) {
      case StatusEffectType.STUN:
      case StatusEffectType.PARALYZE:
      case StatusEffectType.PURIFY:
        return 1;
      case StatusEffectType.FREEZE:
      case StatusEffectType.SHIELD:
      case StatusEffectType.BLESS:
      case StatusEffectType.RAGE:
        return 2;
      case StatusEffectType.BURN:
      case StatusEffectType.REGENERATION:
      case StatusEffectType.CURSE:
        return 3;
      case StatusEffectType.POISON:
        return 4;
      default:
        return 2;
    }
  }

  /**
   * 効果が正の効果かどうかを判定
   */
  private isPositiveEffect(effect: StatusEffectType): boolean {
    const positiveEffects = [
      StatusEffectType.SHIELD,
      StatusEffectType.REGENERATION,
      StatusEffectType.BLESS,
      StatusEffectType.RAGE,
      StatusEffectType.PURIFY
    ];
    return positiveEffects.includes(effect);
  }

  // ===== WEATHER SYSTEM =====

  /**
   * 初期天候を生成
   */
  private generateInitialWeather(): IWeather {
    return {
      type: generateRandomWeather(),
      duration: WEATHER_CONFIG[WeatherKind.CLEAR].duration
    };
  }

  /**
   * 天候を更新
   */
  private updateWeather(): void {
    const shouldChange = updateWeatherDuration(this.state.weather);
    
    if (shouldChange) {
      const newWeatherType = generateDifferentWeather(this.state.weather.type);
      this.state.weather = {
        type: newWeatherType,
        duration: WEATHER_CONFIG[newWeatherType].duration
      };
      
      this.logGameEvent('WEATHER', undefined, undefined, {
        newWeather: newWeatherType,
        duration: this.state.weather.duration
      });
    }
  }

  /**
   * 天候効果を適用
   */
  private applyWeatherEffects(player: IPlayer): void {
    const weatherEffect = checkWeatherStatusEffect(this.state.weather.type);
    if (weatherEffect) {
      player.addStatus(weatherEffect, this.getStatusEffectDuration(weatherEffect));
    }
  }

  // ===== GAME STATE MANAGEMENT =====

  /**
   * ゲーム終了チェック（テスト用メソッド名も提供）
   */
  checkGameEnd(): boolean {
    const alivePlayers = this.state.players.filter(p => p.isAlive());
    
    if (alivePlayers.length <= 1) {
      this.state.phase = GamePhase.END;
      this.state.winner = alivePlayers.length === 1 ? alivePlayers[0].id : undefined;
      this.clearTurnTimer();
      this.logGameEvent('GAME_END', this.state.winner);
      this.broadcastGameState();
      return true;
    }
    
    return false;
  }

  /**
   * ゲーム終了チェック（後方互換性のための別名）
   */
  checkGameOver(): boolean {
    return this.checkGameEnd();
  }

  /**
   * 全プレイヤーを取得
   */
  getPlayers(): IPlayer[] {
    return this.state.players;
  }

  /**
   * ターンタイマーを開始
   */
  private startTurnTimer(): void {
    this.clearTurnTimer();
    
    try {
      this.turnTimer = setTimeout(() => {
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer) {
          this.endTurn(currentPlayer.id);
        }
      }, this.TURN_TIME_LIMIT);
    } catch (error) {
      console.error('Failed to start turn timer:', error);
    }
  }

  /**
   * ターンタイマーをクリア
   */
  private clearTurnTimer(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = undefined;
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * 現在のプレイヤーを取得
   */
  getCurrentPlayer(): IPlayer | null {
    return this.state.players.find(p => p.id === this.state.currentPlayerId) || null;
  }

  /**
   * プレイヤーを取得
   */
  getPlayer(id: string): IPlayer | null {
    return this.state.players.find(p => p.id === id) || null;
  }

  /**
   * 有効なプレイヤーかチェック
   */
  private isValidPlayer(playerId: string): boolean {
    return this.state.players.some(p => p.id === playerId);
  }

  /**
   * ゲーム状態を取得
   */
  getState(): IGameState {
    return this.state;
  }

  /**
   * ゲームイベントをログに記録
   */
  private logGameEvent(
    type: IGameEvent['type'], 
    sourcePlayerId?: string, 
    targetPlayerId?: string, 
    data?: unknown
  ): void {
    const event: IGameEvent = {
      id: uuidv4(),
      type,
      sourcePlayerId,
      targetPlayerId,
      data,
      timestamp: Date.now()
    };
    this.gameEvents.push(event);
  }

  /**
   * ゲーム状態をブロードキャスト
   */
  private broadcastGameState(): void {
    if (!this.io) return;

    try {
      const state = this.getState();
      this.io.emit('gameState', state);
    } catch (error) {
      console.error('Failed to broadcast game state:', error);
    }
  }

  /**
   * ゲームの詳細情報を取得（デバッグ用）
   */
  getDetailedInfo() {
    return {
      gameId: this.state.id,
      phase: this.state.phase,
      currentTurn: this.state.currentTurn,
      currentPlayer: this.state.currentPlayerId,
      weather: {
        type: this.state.weather.type,
        duration: this.state.weather.duration,
        config: WEATHER_CONFIG[this.state.weather.type]
      },
      players: this.state.players.map(p => ({
        id: p.id,
        name: p.name,
        hp: `${p.hp}/${p.maxHp}`,
        mp: `${p.mp}/${p.maxMp}`,
        handSize: p.hand.length,
        statusEffects: p.statusEffects.length,
        isAlive: p.isAlive()
      })),
      recentEvents: this.gameEvents.slice(-5),
      gameMode: this.state.gameMode
    };
  }

  public applyStatusEffect(playerId: string, effect: StatusEffectType): void {
    const player = this.getPlayer(playerId);
    if (!player) {
      throw new Error('プレイヤーが見つかりません。');
    }

    const duration = STATUS_EFFECT_CONFIG[effect].duration;
    player.addStatus(effect, duration);

    // 即時効果の適用
    switch (effect) {
      case StatusEffectType.FREEZE:
        player.mpCostMultiplier = 1.5;
        break;
      case StatusEffectType.SHIELD:
        player.damageReceivedMultiplier = 0.8;
        break;
      case StatusEffectType.CURSE:
        player.damageMultiplier = 0.8;
        break;
      case StatusEffectType.BLESS:
        player.damageMultiplier = 1.2;
        break;
    }
  }

  public getWinner(): string | null {
    const alivePlayers = this.state.players.filter(p => p.hp > 0);
    return alivePlayers.length === 1 ? alivePlayers[0].id : null;
  }

  public setWeather(weather: IWeather): void {
    this.state.weather = weather;
  }

  public calculateDamage(baseDamage: number, attacker: IPlayer, defender: IPlayer, element: ElementKind): number {
    let damage = baseDamage;
    
    // 攻撃側の補正
    damage *= attacker.damageMultiplier;
    
    // 防御側の補正
    damage *= defender.damageReceivedMultiplier;
    
    // 天候補正
    const weather = this.state.weather;
    if (weather) {
      const weatherConfig = WEATHER_CONFIG[weather.type];
      if (weatherConfig.bonus[element]) {
        damage *= 1.2;
      }
      if (weatherConfig.penalty[element]) {
        damage *= 0.8;
      }
    }
    
    return Math.floor(damage);
  }

  /**
   * カードをプレイする
   */
  handleCardPlay(playerId: string, cardIndex: number, targetId?: string): void {
    this.playCard(playerId, cardIndex, targetId);
  }
}