import { GameState, ICardData, IPlayer } from '../../../shared/types/game.js';

interface RecoveryState {
  gameState?: Partial<GameState>;
  playerState?: Partial<IPlayer>;
  cardState?: Partial<ICardData>;
}

class ErrorRecovery {
  private static instance: ErrorRecovery;
  private recoveryStates: Map<string, RecoveryState> = new Map();
  private readonly MAX_STATES = 10;
  private recoveryStats = {
    totalAttempts: 0,
    successfulRecoveries: 0
  };

  private constructor() {}

  static getInstance(): ErrorRecovery {
    if (!ErrorRecovery.instance) {
      ErrorRecovery.instance = new ErrorRecovery();
    }
    return ErrorRecovery.instance;
  }

  // ゲーム状態のスナップショットを保存
  saveState(key: string, state: RecoveryState): void {
    this.recoveryStates.set(key, state);
    
    // 最大数を超えた場合、古いものを削除
    if (this.recoveryStates.size > this.MAX_STATES) {
      const oldestKey = this.recoveryStates.keys().next().value;
      this.recoveryStates.delete(oldestKey);
    }
  }

  // 保存した状態を復元
  recoverState(key: string): RecoveryState | undefined {
    return this.recoveryStates.get(key);
  }

  // エラー発生時の自動リカバリー処理
  async autoRecover(error: Error, context: {
    type: 'GAME' | 'PLAYER' | 'CARD';
    action: string;
    data: any;
  }): Promise<boolean> {
    this.recoveryStats.totalAttempts++;

    try {
      let recovered = false;
      switch (context.type) {
        case 'GAME':
          recovered = await this.recoverGameState(context);
          break;
        case 'PLAYER':
          recovered = await this.recoverPlayerState(context);
          break;
        case 'CARD':
          recovered = await this.recoverCardState(context);
          break;
        default:
          recovered = false;
      }

      if (recovered) {
        this.recoveryStats.successfulRecoveries++;
      }

      return recovered;
    } catch (e) {
      console.error('リカバリー処理中にエラーが発生しました:', e);
      return false;
    }
  }

  // ゲーム状態のリカバリー
  private async recoverGameState(context: {
    action: string;
    data: any;
  }): Promise<boolean> {
    const lastValidState = this.recoverState('lastValidGameState');
    if (!lastValidState?.gameState) return false;

    try {
      // アクションに応じたリカバリー処理
      switch (context.action) {
        case 'PLAY_CARD':
          // カードプレイのロールバック
          return true;
        case 'END_TURN':
          // ターン終了のロールバック
          return true;
        case 'WEATHER_CHANGE':
          // 天候変更のロールバック
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.error('ゲーム状態のリカバリーに失敗しました:', e);
      return false;
    }
  }

  // プレイヤー状態のリカバリー
  private async recoverPlayerState(context: {
    action: string;
    data: any;
  }): Promise<boolean> {
    const lastValidState = this.recoverState('lastValidPlayerState');
    if (!lastValidState?.playerState) return false;

    try {
      // アクションに応じたリカバリー処理
      switch (context.action) {
        case 'DRAW_CARD':
          // カードドローのロールバック
          return true;
        case 'TAKE_DAMAGE':
          // ダメージ処理のロールバック
          return true;
        case 'APPLY_STATUS':
          // 状態異常のロールバック
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.error('プレイヤー状態のリカバリーに失敗しました:', e);
      return false;
    }
  }

  // カード状態のリカバリー
  private async recoverCardState(context: {
    action: string;
    data: any;
  }): Promise<boolean> {
    const lastValidState = this.recoverState('lastValidCardState');
    if (!lastValidState?.cardState) return false;

    try {
      // アクションに応じたリカバリー処理
      switch (context.action) {
        case 'MODIFY_CARD':
          // カード修正のロールバック
          return true;
        case 'ENHANCE_CARD':
          // カード強化のロールバック
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.error('カード状態のリカバリーに失敗しました:', e);
      return false;
    }
  }

  // リカバリー成功率の計算
  getRecoveryStats(): {
    totalAttempts: number;
    successfulRecoveries: number;
    recoveryRate: number;
  } {
    const { totalAttempts, successfulRecoveries } = this.recoveryStats;
    return {
      totalAttempts,
      successfulRecoveries,
      recoveryRate: totalAttempts > 0 ? 
        (successfulRecoveries / totalAttempts) * 100 : 0
    };
  }
}

export default ErrorRecovery; 