import { IGameState, IPlayer, ICardData, Card } from '../../shared/types/game.js';
import { cards } from '../data/cards.js';

interface GameAction {
  type: 'play' | 'draw' | 'discard' | 'attack' | 'defend' | 'effect';
  timestamp: number;
  playerId: string;
  targetId?: string;
  cardId?: string;
  value?: number;
  position?: { x: number; y: number };
}

interface ReplayData {
  id: string;
  gameId: string;
  startTime: Date;
  endTime: Date;
  players: IPlayer[];
  initialState: IGameState;
  actions: GameAction[];
  winner: string;
  duration: number;
  version: string;
  tags: string[];
}

interface ReplayMetadata {
  id: string;
  gameId: string;
  players: { id: string; name: string }[];
  winner: string;
  duration: number;
  timestamp: Date;
  views: number;
  likes: number;
  tags: string[];
}

export class ReplayService {
  private replays: Map<string, ReplayData> = new Map();
  private metadata: Map<string, ReplayMetadata> = new Map();
  private currentReplay: ReplayData | null = null;
  private replaySpeed: number = 1;
  private currentActionIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  startRecording(gameId: string, initialState: IGameState): void {
    this.currentReplay = {
      id: this.generateReplayId(),
      gameId,
      startTime: new Date(),
      endTime: new Date(),
      players: [...initialState.players],
      initialState: JSON.parse(JSON.stringify(initialState)),
      actions: [],
      winner: '',
      duration: 0,
      version: '1.0.0',
      tags: []
    };
  }

  recordAction(action: Omit<GameAction, 'timestamp'>): void {
    if (!this.currentReplay) return;

    const fullAction: GameAction = {
      ...action,
      timestamp: Date.now() - this.currentReplay.startTime.getTime()
    };

    this.currentReplay.actions.push(fullAction);
  }

  stopRecording(winner: string): string {
    if (!this.currentReplay) return '';

    this.currentReplay.endTime = new Date();
    this.currentReplay.winner = winner;
    this.currentReplay.duration = 
      this.currentReplay.endTime.getTime() - this.currentReplay.startTime.getTime();

    const replayId = this.currentReplay.id;
    this.replays.set(replayId, this.currentReplay);

    // メタデータを作成
    const metadata: ReplayMetadata = {
      id: replayId,
      gameId: this.currentReplay.gameId,
      players: this.currentReplay.players.map(p => ({
        id: p.id,
        name: p.name
      })),
      winner,
      duration: this.currentReplay.duration,
      timestamp: this.currentReplay.startTime,
      views: 0,
      likes: 0,
      tags: this.currentReplay.tags
    };
    this.metadata.set(replayId, metadata);

    this.currentReplay = null;
    return replayId;
  }

  playReplay(replayId: string, onStateUpdate: (state: IGameState) => void): void {
    const replay = this.replays.get(replayId);
    if (!replay || !onStateUpdate) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentActionIndex = 0;

    // メタデータの視聴回数を更新
    const metadata = this.metadata.get(replayId);
    if (metadata) {
      metadata.views++;
    }

    let currentState = JSON.parse(JSON.stringify(replay.initialState));
    onStateUpdate(currentState);

    const playNextAction = () => {
      if (!this.isPlaying || this.isPaused) return;
      if (this.currentActionIndex >= replay.actions.length) {
        this.isPlaying = false;
        return;
      }

      const action = replay.actions[this.currentActionIndex];
      if (!action) return;

      currentState = this.applyAction(currentState, action);
      onStateUpdate(currentState);

      this.currentActionIndex++;

      const nextAction = replay.actions[this.currentActionIndex];
      if (!nextAction) return;

      const delay = (nextAction.timestamp - action.timestamp) / this.replaySpeed;
      setTimeout(playNextAction, delay);
    };

    playNextAction();
  }

  private applyAction(state: IGameState, action: GameAction): IGameState {
    if (!state || !action) return state;

    const newState = JSON.parse(JSON.stringify(state));
    const player = newState.players.find((p: IPlayer) => p.id === action.playerId);
    if (!player) return newState;

    switch (action.type) {
      case 'play':
        if (action.cardId) {
          const cardIndex = player.hand.findIndex((c: ICardData) => c.id === action.cardId);
          if (cardIndex >= 0) {
            player.hand.splice(cardIndex, 1);
          }
        }
        break;

      case 'draw':
        if (action.cardId) {
          const card = this.findCardById(action.cardId);
          if (card) {
            player.hand.push(card);
          }
        }
        break;

      case 'attack':
        if (action.targetId && typeof action.value === 'number') {
          const target = newState.players.find((p: IPlayer) => p.id === action.targetId);
          if (target) {
            target.hp = Math.max(0, target.hp - action.value);
          }
        }
        break;

      case 'defend':
        if (typeof action.value === 'number') {
          player.hp = Math.min(player.maxHp, player.hp + action.value);
        }
        break;

      case 'effect':
        // 特殊効果の適用（状態異常など）
        if (action.value && action.targetId) {
          const target = newState.players.find((p: IPlayer) => p.id === action.targetId);
          if (target) {
            // 状態異常の適用ロジックを実装
          }
        }
        break;
    }

    return newState;
  }

  private findCardById(cardId: string): ICardData | null {
    return cards.find(card => card.id === cardId) || null;
  }

  pauseReplay(): void {
    this.isPaused = true;
  }

  resumeReplay(): void {
    this.isPaused = false;
  }

  stopReplay(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentActionIndex = 0;
  }

  setReplaySpeed(speed: number): void {
    this.replaySpeed = Math.max(0.1, Math.min(10, speed));
  }

  getReplayMetadata(replayId: string): ReplayMetadata | undefined {
    return this.metadata.get(replayId);
  }

  searchReplays(filters: {
    playerIds?: string[];
    winner?: string;
    dateFrom?: Date;
    dateTo?: Date;
    tags?: string[];
  }): ReplayMetadata[] {
    return Array.from(this.metadata.values()).filter(metadata => {
      if (filters.playerIds && !filters.playerIds.some(id => metadata.players.some(p => p.id === id))) {
        return false;
      }
      if (filters.winner && metadata.winner !== filters.winner) {
        return false;
      }
      if (filters.dateFrom && metadata.timestamp < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && metadata.timestamp > filters.dateTo) {
        return false;
      }
      if (filters.tags && !filters.tags.every(tag => metadata.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }

  likeReplay(replayId: string): void {
    const metadata = this.metadata.get(replayId);
    if (metadata) {
      metadata.likes++;
    }
  }

  private generateReplayId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 