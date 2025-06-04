import { ErrorTemplate, ErrorSeverity } from '../types/error';

interface ErrorStyles {
  backgroundColor: string;
  borderColor: string;
  color: string;
}

type Language = 'ja' | 'en';

export class ErrorMessageManager {
  private static instance: ErrorMessageManager;
  private errorTemplates: Map<string, ErrorTemplate>;
  private currentLanguage: Language;

  private constructor() {
    this.errorTemplates = new Map();
    this.currentLanguage = 'ja'; // デフォルトは日本語
    this.initializeTemplates();
  }

  public static getInstance(): ErrorMessageManager {
    if (!ErrorMessageManager.instance) {
      ErrorMessageManager.instance = new ErrorMessageManager();
    }
    return ErrorMessageManager.instance;
  }

  public setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  private initializeTemplates() {
    // エラーテンプレートの初期化
    this.errorTemplates.set('GAME_STATE_INVALID', {
      code: 'GSI001',
      message: {
        ja: 'ゲーム状態が無効です',
        en: 'Invalid game state'
      },
      severity: 'error',
      category: 'game'
    });

    this.errorTemplates.set('GAME_NOT_INITIALIZED', {
      code: 'GNI001',
      message: {
        ja: 'ゲームが初期化されていません',
        en: 'Game not initialized'
      },
      severity: 'error',
      category: 'game'
    });

    this.errorTemplates.set('CONNECTION_LOST', {
      code: 'CNL001',
      message: {
        ja: 'サーバーとの接続が切断されました',
        en: 'Connection lost'
      },
      severity: 'warning',
      category: 'network'
    });

    this.errorTemplates.set('CONNECTION_FAILED', {
      code: 'CNF001',
      message: {
        ja: 'サーバーへの接続に失敗しました',
        en: 'Connection failed'
      },
      severity: 'error',
      category: 'network'
    });

    this.errorTemplates.set('SYSTEM_ERROR', {
      code: 'SYS001',
      message: {
        ja: 'システムエラーが発生しました',
        en: 'System error occurred'
      },
      severity: 'error',
      category: 'system'
    });
  }

  public getErrorTemplate(errorKey: string, context?: any): ErrorTemplate {
    const template = this.errorTemplates.get(errorKey);
    if (!template) {
      return {
        code: 'UNK001',
        message: {
          ja: '不明なエラーが発生しました',
          en: 'Unknown error occurred'
        },
        severity: 'error',
        category: 'system'
      };
    }
    return template;
  }

  public getErrorMessage(errorKey: string, context?: any): string {
    const template = this.getErrorTemplate(errorKey, context);
    return template.message[this.currentLanguage];
  }

  public getSeverityStyle(severity: ErrorSeverity): ErrorStyles {
    switch (severity) {
      case 'error':
        return {
          backgroundColor: '#ff000022',
          borderColor: '#ff0000',
          color: '#ff0000'
        };
      case 'warning':
        return {
          backgroundColor: '#ffff0022',
          borderColor: '#ffff00',
          color: '#ffff00'
        };
      case 'info':
        return {
          backgroundColor: '#0000ff22',
          borderColor: '#0000ff',
          color: '#0000ff'
        };
      default:
        return {
          backgroundColor: '#ffffff22',
          borderColor: '#ffffff',
          color: '#ffffff'
        };
    }
  }
} 