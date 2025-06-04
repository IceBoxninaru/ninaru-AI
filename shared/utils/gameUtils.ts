import { IPlayer, ICardData, ElementKind, StatusEffectType, WeatherKind } from '../types/game';
import { IPlayerInfo, ICardInfo, IGameInfo, IStatusEffectConfig } from './types';

// ステータス効果の設定
export const STATUS_EFFECT_CONFIG: Record<StatusEffectType, IStatusEffectConfig> = {
  BURN: {
    name: '炎上',
    description: 'ターン終了時にダメージを受ける',
    duration: 3,
    icon: '🔥',
    color: '#ff4500'
  },
  FREEZE: {
    name: '凍結',
    description: 'MPコストが増加する',
    duration: 2,
    icon: '❄️',
    color: '#00ffff'
  },
  POISON: {
    name: '毒',
    description: 'ターン終了時に大きなダメージを受ける',
    duration: 2,
    icon: '☠️',
    color: '#800080'
  },
  STUN: {
    name: '気絶',
    description: 'カードを使用できない',
    duration: 1,
    icon: '💫',
    color: '#ffd700'
  },
  SHIELD: {
    name: '防御',
    description: '受けるダメージが半減する',
    duration: 1,
    icon: '🛡️',
    color: '#4169e1'
  },
  REGEN: {
    name: '再生',
    description: 'ターン開始時にHPが回復する',
    duration: 3,
    icon: '💚',
    color: '#32cd32'
  },
  REGENERATION: {
    name: '再生',
    description: 'ターン開始時にHPが回復する',
    duration: 3,
    icon: '💚',
    color: '#32cd32'
  }
};

// 属性の設定
export const ELEMENT_CONFIG: Record<ElementKind, { name: string; icon: string; color: string }> = {
  FIRE: { name: '火', icon: '🔥', color: '#ff4500' },
  WATER: { name: '水', icon: '💧', color: '#00ffff' },
  EARTH: { name: '地', icon: '🌍', color: '#8b4513' },
  WIND: { name: '風', icon: '🌪️', color: '#98fb98' },
  LIGHT: { name: '光', icon: '✨', color: '#ffd700' },
  DARK: { name: '闇', icon: '🌑', color: '#800080' },
  NEUTRAL: { name: '無', icon: '⚪', color: '#808080' }
};

// 天候の設定
export const WEATHER_CONFIG: Record<WeatherKind, { name: string; icon: string; description: string }> = {
  SUNNY: { name: '晴天', icon: '☀️', description: '火属性が強化され、水属性が弱体化する' },
  RAINY: { name: '雨天', icon: '🌧️', description: '水属性が強化され、火属性が弱体化する' },
  WINDY: { name: '強風', icon: '🌪️', description: '風属性が強化され、地属性が弱体化する' },
  STORMY: { name: '嵐', icon: '⛈️', description: '全ての属性にランダムな効果' },
  SACRED: { name: '神聖', icon: '🌟', description: '光属性が強化され、闇属性が弱体化する' },
  FOGGY: { name: '霧', icon: '🌫️', description: '闇属性が強化され、光属性が弱体化する' },
  CLEAR: { name: '快晴', icon: '🌤️', description: '特に効果なし' }
};

// プレイヤー情報の変換
export function convertToPlayerInfo(player: IPlayer, currentPlayerId: string): IPlayerInfo {
  return {
    id: player.id,
    name: player.name,
    hp: player.hp,
    maxHp: player.maxHp,
    mp: player.mp,
    maxMp: player.maxMp,
    gold: player.gold,
    faith: player.faith,
    combo: player.combo,
    maxCombo: player.maxCombo,
    statusEffects: Array.from(player.status.keys()),
    isCurrentPlayer: player.id === currentPlayerId
  };
}

// カード情報の変換
export function convertToCardInfo(card: ICardData, player: IPlayer): ICardInfo {
  const isPlayable = canPlayCard(card, player);
  return {
    id: card.id,
    name: card.name,
    description: card.description,
    element: card.element,
    power: card.power,
    shield: card.shield,
    mpCost: card.mpCost,
    isPlayable
  };
}

// カードが使用可能かどうかの判定
export function canPlayCard(card: ICardData, player: IPlayer): boolean {
  if (player.status.has('STUN')) return false;
  if (card.mpCost * player.mpCostMultiplier > player.mp) return false;
  return true;
}

// ダメージ計算
export function calculateDamage(
  baseDamage: number,
  attacker: IPlayer,
  defender: IPlayer,
  element: ElementKind,
  weather: IWeather
): number {
  let damage = baseDamage;

  // 攻撃側の補正
  damage *= attacker.damageMultiplier;

  // 防御側の補正
  if (defender.statusEffects.some(effect => effect.type === 'SHIELD')) {
    damage *= 0.5;
  }
  damage *= defender.damageReceivedMultiplier;

  // 天候補正
  switch (weather.type) {
    case 'SUNNY':
      if (element === 'FIRE') damage *= 1.5;
      if (element === 'WATER') damage *= 0.7;
      break;
    case 'RAINY':
      if (element === 'WATER') damage *= 1.5;
      if (element === 'FIRE') damage *= 0.7;
      break;
    case 'WINDY':
      if (element === 'WIND') damage *= 1.5;
      if (element === 'EARTH') damage *= 0.7;
      break;
    case 'STORMY':
      damage *= 1.2; // すべての属性が強化
      break;
    case 'SACRED':
      if (element === 'LIGHT') damage *= 1.5;
      if (element === 'DARK') damage *= 0.7;
      break;
    case 'FOGGY':
      if (element === 'DARK') damage *= 1.5;
      if (element === 'LIGHT') damage *= 0.7;
      break;
  }

  return Math.floor(damage);
}

// ステータス効果の適用
export function applyStatusEffect(player: IPlayer, effect: StatusEffectType): void {
  const config = STATUS_EFFECT_CONFIG[effect];
  if (!config) return;

  player.status.set(effect, config.duration);
}

// ゲーム情報の変換
export function convertToGameInfo(
  currentTurn: number,
  currentPlayer: IPlayer | null,
  weather: IWeather,
  phase: string
): IGameInfo {
  return {
    currentTurn,
    currentPlayer,
    weather: WEATHER_CONFIG[weather.type]?.name || '不明',
    phase
  };
} 