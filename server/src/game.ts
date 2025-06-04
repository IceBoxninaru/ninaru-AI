import { Server, Socket } from 'socket.io';
import {
  IGameState,
  IPlayer,
  ICardData,
  WeatherKind,
  StatusEffectType,
  ElementKind,
  IDamageEvent,
  GamePhase,
  IWeather
} from '../../shared/types/game';
import { WEATHER_CONFIG } from '../schema/weather';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import {
  calculateDamage as utilCalculateDamage,
  applyStatusEffect as utilApplyStatusEffect
} from '../../shared/utils/gameUtils';

export class Game {
  private state: IGameState;
  private sockets: Map<string, Socket>;
  private io: Server;
  private currentPlayerIndex: number;

  constructor(io: Server) {
    this.io = io;
    this.sockets = new Map();
    this.state = this.initializeGameState();
    this.currentPlayerIndex = 0;
  }

  private initializeGameState(): IGameState {
    return {
      id: uuidv4(),
      currentTurn: 1,
      currentPlayerId: '',
      players: [],
      weather: this.generateInitialWeather(),
      phase: GamePhase.WAIT,
      turn: 1
    };
  }

  private generateInitialWeather(): IWeather {
    const weatherTypes = Object.keys(WEATHER_CONFIG) as WeatherKind[];
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    return {
      type: randomWeather,
      duration: WEATHER_CONFIG[randomWeather].duration
    };
  }

  public addPlayer(socket: Socket, name: string): void {
    const player = new Player(name, socket.id);
    this.state.players.push(player);
    this.sockets.set(socket.id, socket);

    if (this.state.players.length === 1) {
      this.state.currentPlayerId = socket.id;
    }

    if (this.state.players.length === 2) {
      this.startGame();
    }

    this.broadcastGameState();
  }

  private startGame(): void {
    this.state.phase = GamePhase.DRAW;
    this.state.players.forEach(player => {
      if (player instanceof Player) {
        player.drawCard();
      }
    });
    this.broadcastGameState();
  }

  public handleCardPlay(playerId: string, cardIndex: number, targetId?: string): void {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player || this.state.currentPlayerId !== playerId || this.state.phase !== GamePhase.MAIN) return;

    const card = player.hand[cardIndex];
    if (!card || player.mp < card.mpCost * player.mpCostMultiplier) return;

    // カードの効果を適用
    this.applyCardEffect(card, player, targetId);

    // 手札からカードを除去し、捨て札に加える
    const playedCard = player.hand.splice(cardIndex, 1)[0];
    player.discardPile.push(playedCard);
    
    // MPを消費
    player.spendMp(card.mpCost);

    // コンボシステムの更新
    if (card.comboValue) {
      player.addCombo(card.comboValue);
    }

    // 信仰値の更新
    if (card.faithCost) {
      player.spendFaith(card.faithCost);
    }

    // 最後に使用した属性を記録
    player.lastPlayedElement = card.element;

    // ゲーム状態を更新
    this.checkGameEnd();
    this.broadcastGameState();
  }

  private applyCardEffect(card: ICardData, player: IPlayer, targetId?: string): void {
    const target = targetId ? this.state.players.find(p => p.id === targetId) : player;
    if (!target) return;

    // 天候による効果の修正
    let damageMultiplier = player.damageMultiplier;
    const weatherConfig = WEATHER_CONFIG[this.state.weather.type];
    if (weatherConfig) {
      if (weatherConfig.bonus[card.element]) damageMultiplier *= 1.5;
      if (weatherConfig.penalty[card.element]) damageMultiplier *= 0.5;
    }

    // カードの種類に応じた効果を適用
    switch (card.type) {
      case 'ATTACK':
        if (card.power && target !== player) {
          const damage = Math.floor(card.power * damageMultiplier * target.damageReceivedMultiplier);
          this.applyDamage({
            sourceId: player.id,
            targetId: target.id,
            amount: damage,
            element: card.element,
            isCritical: player.combo >= player.maxCombo
          });
        }
        break;
      case 'DEFENSE':
        if (card.shield) {
          target.addStatus(StatusEffectType.SHIELD, 1);
        }
        break;
      case 'SUPPORT':
        if (card.effects) {
          card.effects.forEach(effect => {
            if (effect === StatusEffectType.REGENERATION) {
              target.heal(Math.floor(target.maxHp * 0.2));
            }
            target.addStatus(effect as StatusEffectType, 2);
          });
        }
        break;
    }
  }

  private applyDamage(event: IDamageEvent): void {
    const target = this.state.players.find(p => p.id === event.targetId);
    if (!target) return;

    if (target.status.has(StatusEffectType.SHIELD)) {
      event.isBlocked = true;
      target.removeStatus(StatusEffectType.SHIELD);
    } else {
      target.takeDamage(event.amount);
    }

    this.broadcastGameEvent({ type: 'DAMAGE', data: event });
  }

  public endTurn(playerId: string): void {
    if (this.state.currentPlayerId !== playerId || this.state.phase !== GamePhase.MAIN) return;

    const currentPlayer = this.state.players[this.currentPlayerIndex];
    
    // ステータス効果の更新
    if (currentPlayer instanceof Player) {
      currentPlayer.updateStatuses();
      currentPlayer.gainMp(10);
      currentPlayer.resetCombo();
    }

    // 次のプレイヤーへ
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.state.players.length;
    this.state.currentPlayerId = this.state.players[this.currentPlayerIndex].id;
    this.state.currentTurn++;

    // 天候の更新
    this.updateWeather();

    // フェーズの更新
    this.state.phase = GamePhase.DRAW;
    this.broadcastGameState();
  }

  private updateWeather(): void {
    this.state.weather.duration--;
    if (this.state.weather.duration <= 0) {
      this.state.weather = this.generateInitialWeather();
    }
  }

  private broadcastGameState(): void {
    this.sockets.forEach(socket => {
      socket.emit('gameState', this.state);
    });
  }

  private broadcastGameEvent(event: { type: string, data: any }): void {
    this.sockets.forEach(socket => {
      socket.emit('gameEvent', event);
    });
  }

  public setWeather(weather: IWeather): void {
    this.state.weather = weather;
    this.broadcastGameState();
  }

  public calculateDamage(
    power: number,
    attacker: IPlayer,
    defender: IPlayer,
    element: ElementKind
  ): number {
    return utilCalculateDamage(power, attacker, defender, element, this.state.weather);
  }

  public applyStatusEffect(playerId: string, effect: StatusEffectType): void {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return;
    utilApplyStatusEffect(player, effect);
  }

  public removePlayer(playerId: string): void {
    const playerIndex = this.state.players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
      this.state.players.splice(playerIndex, 1);
      this.sockets.delete(playerId);
      this.broadcastGameState();
    }
  }

  public getState(): IGameState {
    return this.state;
  }

  private checkGameEnd(): void {
    const alivePlayers = this.state.players.filter(p => p.hp > 0);
    if (alivePlayers.length <= 1 && this.state.players.length > 1) {
      this.state.phase = GamePhase.END;
      this.state.winner = alivePlayers[0]?.id;
      this.broadcastGameState();
    }
  }
} 