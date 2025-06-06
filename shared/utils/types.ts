import { IPlayer, ICardData, ElementKind, StatusEffectType } from '../types/game.js';

// ゲーム情報の表示用インターフェース
export interface IGameInfo {
  currentTurn: number;
  currentPlayer: IPlayer | null;
  weather: string;
  phase: string;
}

// プレイヤー情報の表示用インターフェース
export interface IPlayerInfo {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;
  faith: number;
  combo: number;
  maxCombo: number;
  statusEffects: StatusEffectType[];
  isCurrentPlayer: boolean;
}

// カード情報の表示用インターフェース
export interface ICardInfo {
  id: string;
  name: string;
  description: string;
  element: ElementKind;
  power?: number;
  shield?: number;
  mpCost: number;
  isPlayable: boolean;
}

// ステータス効果の設定をする
export interface IStatusEffectConfig {
  name: string;
  description: string;
  duration: number;
  icon: string;
  color: string;
}

// エラーメッセージの型
export interface IErrorMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
} 