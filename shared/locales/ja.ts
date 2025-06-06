import { ErrorTemplate } from '../constants/errorMessages.js';

export const jaErrorMessages: Record<string, Omit<ErrorTemplate, 'code' | 'severity'>> = {
  // 接続関連のエラー
  'CONNECTION_LOST': {
    title: '接続エラー',
    message: 'サーバーとの接続が切断されました。',
    suggestion: '通信環境を確認し、ページを再読み込みしてください。'
  },
  'CONNECTION_FAILED': {
    title: '接続エラー',
    message: 'サーバーへの接続に失敗しました。',
    suggestion: 'しばらく待ってから再試行してください。'
  },

  // ゲーム状態関連のエラー
  'GAME_STATE_INVALID': {
    title: 'ゲーム状態エラー',
    message: 'ゲーム状態が不正です。',
    suggestion: 'ゲームを再起動してください。'
  },
  'GAME_NOT_INITIALIZED': {
    title: '初期化エラー',
    message: 'ゲームが正しく初期化されていません。',
    suggestion: 'ページを再読み込みしてください。'
  },

  // カード操作関連のエラー
  'CARD_NOT_FOUND': {
    title: 'カードエラー',
    message: '指定されたカードが見つかりません。',
    suggestion: 'カードの選択をやり直してください。'
  },
  'INVALID_CARD_PLAY': {
    title: 'カード使用エラー',
    message: 'このカードは現在使用できません。',
    suggestion: '別のカードを選択してください。'
  },

  // プレイヤー関連のエラー
  'PLAYER_NOT_FOUND': {
    title: 'プレイヤーエラー',
    message: '指定されたプレイヤーが見つかりません。',
    suggestion: '対象プレイヤーを再選択してください。'
  },
  'INVALID_TURN': {
    title: 'ターンエラー',
    message: '現在のターンではありません。',
    suggestion: 'あなたのターンまでお待ちください。'
  },

  // リカバリー関連の通知
  'RECOVERY_IN_PROGRESS': {
    title: 'リカバリー実行中',
    message: 'エラーから回復を試みています。',
    suggestion: 'しばらくお待ちください。'
  },
  'RECOVERY_SUCCESS': {
    title: 'リカバリー成功',
    message: 'エラーから正常に回復しました。',
    suggestion: 'ゲームを続行できます。'
  }
}; 