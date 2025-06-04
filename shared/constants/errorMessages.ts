export interface ErrorTemplate {
  code: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  suggestion?: string;
}

export const ERROR_MESSAGES: Record<string, ErrorTemplate> = {
  // 接続関連のエラー
  'CONNECTION_LOST': {
    code: 'E001',
    severity: 'ERROR',
    title: '接続エラー',
    message: 'サーバーとの接続が切断されました。',
    suggestion: '通信環境を確認し、ページを再読み込みしてください。'
  },
  'CONNECTION_FAILED': {
    code: 'E002',
    severity: 'ERROR',
    title: '接続エラー',
    message: 'サーバーへの接続に失敗しました。',
    suggestion: 'しばらく待ってから再試行してください。'
  },

  // ゲーム状態関連のエラー
  'GAME_STATE_INVALID': {
    code: 'E101',
    severity: 'ERROR',
    title: 'ゲーム状態エラー',
    message: 'ゲーム状態が不正です。',
    suggestion: 'ゲームを再起動してください。'
  },
  'GAME_NOT_INITIALIZED': {
    code: 'E102',
    severity: 'ERROR',
    title: '初期化エラー',
    message: 'ゲームが正しく初期化されていません。',
    suggestion: 'ページを再読み込みしてください。'
  },

  // カード操作関連のエラー
  'CARD_NOT_FOUND': {
    code: 'E201',
    severity: 'ERROR',
    title: 'カードエラー',
    message: '指定されたカードが見つかりません。',
    suggestion: 'カードの選択をやり直してください。'
  },
  'INVALID_CARD_PLAY': {
    code: 'E202',
    severity: 'ERROR',
    title: 'カード使用エラー',
    message: 'このカードは現在使用できません。',
    suggestion: '別のカードを選択してください。'
  },

  // プレイヤー関連のエラー
  'PLAYER_NOT_FOUND': {
    code: 'E301',
    severity: 'ERROR',
    title: 'プレイヤーエラー',
    message: '指定されたプレイヤーが見つかりません。',
    suggestion: '対象プレイヤーを再選択してください。'
  },
  'INVALID_TURN': {
    code: 'E302',
    severity: 'WARNING',
    title: 'ターンエラー',
    message: '現在のターンではありません。',
    suggestion: 'あなたのターンまでお待ちください。'
  },

  // リカバリー関連の通知
  'RECOVERY_IN_PROGRESS': {
    code: 'I001',
    severity: 'INFO',
    title: 'リカバリー実行中',
    message: 'エラーから回復を試みています。',
    suggestion: 'しばらくお待ちください。'
  },
  'RECOVERY_SUCCESS': {
    code: 'I002',
    severity: 'INFO',
    title: 'リカバリー成功',
    message: 'エラーから正常に回復しました。',
    suggestion: 'ゲームを続行できます。'
  }
}; 