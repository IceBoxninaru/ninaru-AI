export interface ErrorCodeInfo {
  category: ErrorCategory;
  subCategory: string;
  sequence: number;
  severity: ErrorSeverity;
}

export type ErrorCategory = 
  | 'NETWORK'    // N: ネットワーク関連
  | 'GAME'       // G: ゲーム関連
  | 'CARD'       // C: カード関連
  | 'PLAYER'     // P: プレイヤー関連
  | 'SYSTEM'     // S: システム関連
  | 'INFO';      // I: 情報

export type ErrorSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface ErrorDetails {
  timestamp: number;
  stackTrace?: string;
  context?: {
    component?: string;
    action?: string;
    data?: any;
  };
  attempts?: number;
  resolved?: boolean;
  resolution?: string;
}

export type NetworkSubCategory = 'CONNECTION' | 'TIMEOUT' | 'SYNC';
export type GameSubCategory = 'STATE' | 'INIT' | 'TURN';
export type CardSubCategory = 'PLAY' | 'EFFECT' | 'DECK';
export type PlayerSubCategory = 'AUTH' | 'ACTION' | 'STATE';
export type SystemSubCategory = 'CONFIG' | 'RESOURCE' | 'INTERNAL';
export type InfoSubCategory = 'NOTIFICATION' | 'STATUS' | 'RECOVERY';

export interface SubCategories {
  NETWORK: Record<NetworkSubCategory, string>;
  GAME: Record<GameSubCategory, string>;
  CARD: Record<CardSubCategory, string>;
  PLAYER: Record<PlayerSubCategory, string>;
  SYSTEM: Record<SystemSubCategory, string>;
  INFO: Record<InfoSubCategory, string>;
}

export interface IErrorMessage {
  code: string;
  type: ErrorSeverity;
  title: string;
  message: {
    ja: string;
    en: string;
  };
  suggestion?: {
    ja: string;
    en: string;
  };
  category: ErrorCategory;
}

export interface IErrorContext {
  component?: string;
  action?: string;
  data?: any;
}

export interface IErrorTemplate {
  code: string;
  message: {
    ja: string;
    en: string;
  };
  severity: ErrorSeverity;
  category: ErrorCategory;
}

// エラーコードの生成ルール
export const ERROR_CODE_FORMAT = {
  NETWORK: 'N',    // ネットワークエラー
  GAME: 'G',       // ゲームエラー
  CARD: 'C',       // カードエラー
  PLAYER: 'P',     // プレイヤーエラー
  SYSTEM: 'S',     // システムエラー
  INFO: 'I',       // 情報通知
  
  SUB_CATEGORIES: {
    NETWORK: {
      CONNECTION: 'CON',  // 接続関連
      TIMEOUT: 'TMO',     // タイムアウト
      SYNC: 'SYN'        // 同期関連
    },
    GAME: {
      STATE: 'STA',      // 状態関連
      INIT: 'INI',       // 初期化関連
      TURN: 'TRN'        // ターン関連
    },
    CARD: {
      PLAY: 'PLY',       // プレイ関連
      EFFECT: 'EFT',     // 効果関連
      DECK: 'DCK'        // デッキ関連
    },
    PLAYER: {
      AUTH: 'AUT',       // 認証関連
      ACTION: 'ACT',     // アクション関連
      STATE: 'STA'       // 状態関連
    },
    SYSTEM: {
      CONFIG: 'CFG',     // 設定関連
      RESOURCE: 'RES',   // リソース関連
      INTERNAL: 'INT'    // 内部エラー
    },
    INFO: {
      NOTIFICATION: 'NOT', // 通知
      STATUS: 'STS',      // 状態情報
      RECOVERY: 'REC'     // リカバリー情報
    }
  }
} as const; 