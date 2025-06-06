import {
  IPlayer,
  ICardData,
  ElementKind,
  StatusEffectType,
  WeatherKind,
  IWeather,
  IPlayerInfo,
  ICardInfo,
  IGameInfo,
  IStatusEffectConfig
} from '../types/game.js';

// ===== STATUS EFFECT CONFIGURATIONS =====

export const STATUS_EFFECT_CONFIG: Record<StatusEffectType, IStatusEffectConfig> = {
  [StatusEffectType.BURN]: {
    name: '炎上',
    description: 'ターン終了時にダメージを受ける',
    duration: 3,
    icon: '🔥',
    color: '#ff4500'
  },
  [StatusEffectType.FREEZE]: {
    name: '凍結',
    description: 'MPコストが増加する',
    duration: 2,
    icon: '❄️',
    color: '#00ffff'
  },
  [StatusEffectType.POISON]: {
    name: '毒',
    description: 'ターン終了時に大きなダメージを受ける',
    duration: 2,
    icon: '☠️',
    color: '#800080'
  },
  [StatusEffectType.STUN]: {
    name: '気絶',
    description: 'カードを使用できない',
    duration: 1,
    icon: '💫',
    color: '#ffd700'
  },
  [StatusEffectType.PARALYZE]: {
    name: '麻痺',
    description: '行動が制限される',
    duration: 1,
    icon: '⚡',
    color: '#ffd700'
  },
  [StatusEffectType.SHIELD]: {
    name: '防御',
    description: '受けるダメージが半減する',
    duration: 1,
    icon: '🛡️',
    color: '#4169e1'
  },
  [StatusEffectType.REGENERATION]: {
    name: '再生',
    description: 'ターン開始時にHPが回復する',
    duration: 3,
    icon: '💚',
    color: '#32cd32'
  },
  [StatusEffectType.REGEN]: {
    name: '再生',
    description: 'ターン開始時にHPが回復する',
    duration: 3,
    icon: '💚',
    color: '#32cd32'
  },
  [StatusEffectType.CURSE]: {
    name: '呪い',
    description: '与えるダメージが減少する',
    duration: 3,
    icon: '👻',
    color: '#4b0082'
  },
  [StatusEffectType.BLESS]: {
    name: '祝福',
    description: '回復効果が増加する',
    duration: 2,
    icon: '✨',
    color: '#ffd700'
  },
  [StatusEffectType.RAGE]: {
    name: '激怒',
    description: '与えるダメージが増加する',
    duration: 2,
    icon: '😠',
    color: '#dc143c'
  },
  [StatusEffectType.PURIFY]: {
    name: '浄化',
    description: '負の効果を無効化する',
    duration: 1,
    icon: '✝️',
    color: '#ffffff'
  }
};

// ===== ELEMENT CONFIGURATIONS =====

export const ELEMENT_CONFIG: Record<ElementKind, { name: string; icon: string; color: string }> = {
  [ElementKind.FIRE]: { name: '火', icon: '🔥', color: '#ff4500' },
  [ElementKind.WATER]: { name: '水', icon: '💧', color: '#00ffff' },
  [ElementKind.EARTH]: { name: '地', icon: '🌍', color: '#8b4513' },
  [ElementKind.WIND]: { name: '風', icon: '🌪️', color: '#98fb98' },
  [ElementKind.LIGHT]: { name: '光', icon: '✨', color: '#ffd700' },
  [ElementKind.DARK]: { name: '闇', icon: '🌑', color: '#800080' },
  [ElementKind.NEUTRAL]: { name: '無', icon: '⚪', color: '#808080' }
};

// ===== WEATHER CONFIGURATIONS =====

export const WEATHER_CONFIG: Record<WeatherKind, {
  name: string;
  icon: string;
  description: string;
  bonus: Record<ElementKind, boolean>;
  penalty: Record<ElementKind, boolean>;
}> = {
  [WeatherKind.SUNNY]: {
    name: '晴天',
    icon: '☀️',
    description: '火属性と光属性が強化され、水属性と闇属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: true, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: true,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: true,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.RAINY]: {
    name: '雨天',
    icon: '🌧️',
    description: '水属性と地属性が強化され、火属性と風属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: true,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: true, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: true,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.WINDY]: {
    name: '強風',
    icon: '🌪️',
    description: '風属性と無属性が強化され、地属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: true,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: true
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: true,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.STORMY]: {
    name: '嵐',
    icon: '⛈️',
    description: '風属性と闇属性が強化され、地属性と光属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: true,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: true,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: true,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: true,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.SACRED]: {
    name: '神聖',
    icon: '🌟',
    description: '光属性が強化され、闇属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: true,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: true,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.FOGGY]: {
    name: '霧',
    icon: '🌫️',
    description: '闇属性が強化され、光属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: true,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: true,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.CLEAR]: {
    name: '快晴',
    icon: '🌤️',
    description: '特に効果なし',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.SNOWY]: {
    name: '雪',
    icon: '❄️',
    description: '水属性と地属性が強化され、火属性と風属性が弱体化する',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: true,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: { 
      [ElementKind.FIRE]: true, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: true,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    }
  },
  [WeatherKind.CLOUDY]: {
    name: '曇天',
    icon: '☁️',
    description: 'すべての属性が若干弱体化',
    bonus: { 
      [ElementKind.FIRE]: false, 
      [ElementKind.WATER]: false,
      [ElementKind.EARTH]: false,
      [ElementKind.WIND]: false,
      [ElementKind.LIGHT]: false,
      [ElementKind.DARK]: false,
      [ElementKind.NEUTRAL]: false
    },
    penalty: {
      [ElementKind.FIRE]: true,
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: true,
      [ElementKind.WIND]: true,
      [ElementKind.LIGHT]: true,
      [ElementKind.DARK]: true,
      [ElementKind.NEUTRAL]: true
    }
  }
};

// ===== CONVERSION FUNCTIONS =====

/**
 * プレイヤー情報の変換
 */
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

/**
 * カード情報の変換
 */
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

/**
 * ゲーム情報の変換
 */
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

// ===== GAME LOGIC FUNCTIONS =====

/**
 * カードが使用可能かどうかの判定
 */
export function canPlayCard(card: ICardData, player: IPlayer): boolean {
  // 麻痺状態のチェック
  if (player.status.has(StatusEffectType.STUN) || player.status.has(StatusEffectType.PARALYZE)) {
    return false;
  }
  
  // MPコストのチェック
  const actualMpCost = Math.floor(card.mpCost * player.mpCostMultiplier);
  if (actualMpCost > player.mp) {
    return false;
  }
  
  // 信仰値のチェック
  if (card.faithCost && card.faithCost > player.faith) {
    return false;
  }
  
  // 要件のチェック
  if (card.requirements) {
    if (card.requirements.minCombo && player.combo < card.requirements.minCombo) {
      return false;
    }
    if (card.requirements.minFaith && player.faith < card.requirements.minFaith) {
      return false;
    }
  }
  
  return true;
}

/**
 * ダメージ計算
 */
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
  if (defender.statusEffects.some(effect => effect.type === StatusEffectType.SHIELD)) {
    damage *= 0.5;
  }
  damage *= defender.damageReceivedMultiplier;

  // 天候補正
  const weatherConfig = WEATHER_CONFIG[weather.type];
  if (weatherConfig) {
    if (weatherConfig.bonus[element]) {
      damage *= 1.5;
    } else if (weatherConfig.penalty[element]) {
      damage *= 0.7;
    }
    
    // 曇りの特別処理
    if (weather.type === WeatherKind.CLOUDY) {
      damage *= 0.9;
    }
  }

  // クリティカルヒット
  if (attacker.combo >= attacker.maxCombo) {
    damage *= 2;
  }

  return Math.floor(damage);
}

/**
 * ステータス効果の適用
 */
export function applyStatusEffect(player: IPlayer, effect: StatusEffectType): void {
  const config = STATUS_EFFECT_CONFIG[effect];
  if (!config) return;

  player.status.set(effect, config.duration);
}

/**
 * 天候による属性の修正値を取得
 */
export function getWeatherElementModifier(element: ElementKind, weather: WeatherKind): number {
  const config = WEATHER_CONFIG[weather];
  if (!config) return 1.0;
  
  if (config.bonus[element]) {
    return 1.5;
  } else if (config.penalty[element]) {
    return 0.7;
  } else if (weather === WeatherKind.CLOUDY) {
    return 0.9;
  }
  
  return 1.0;
}

/**
 * プレイヤーが特定のステータス効果を持っているかチェック
 */
export function hasStatusEffect(player: IPlayer, effect: StatusEffectType): boolean {
  return player.status.has(effect) || 
         player.statusEffects.some(e => e.type === effect);
}

/**
 * ステータス効果の残り時間を取得
 */
export function getStatusEffectDuration(player: IPlayer, effect: StatusEffectType): number {
  return player.status.get(effect) || 0;
}

/**
 * プレイヤーの有効HPを計算（継続ダメージを考慮）
 */
export function calculateEffectiveHp(player: IPlayer): number {
  let effectiveHp = player.hp;
  
  // 継続ダメージを計算
  if (hasStatusEffect(player, StatusEffectType.BURN)) {
    const burnDamage = Math.floor(player.maxHp * 0.03);
    const burnDuration = getStatusEffectDuration(player, StatusEffectType.BURN);
    effectiveHp -= burnDamage * burnDuration;
  }
  
  if (hasStatusEffect(player, StatusEffectType.POISON)) {
    const poisonDamage = Math.floor(player.maxHp * 0.05);
    const poisonDuration = getStatusEffectDuration(player, StatusEffectType.POISON);
    effectiveHp -= poisonDamage * poisonDuration;
  }
  
  // 再生効果を計算
  if (hasStatusEffect(player, StatusEffectType.REGENERATION) || 
      hasStatusEffect(player, StatusEffectType.REGEN)) {
    const healAmount = Math.floor(player.maxHp * 0.1);
    const regenDuration = Math.max(
      getStatusEffectDuration(player, StatusEffectType.REGENERATION),
      getStatusEffectDuration(player, StatusEffectType.REGEN)
    );
    effectiveHp += healAmount * regenDuration;
  }
  
  return Math.max(0, Math.min(player.maxHp, effectiveHp));
}

/**
 * カードの実際のコストを計算
 */
export function calculateActualCardCost(card: ICardData, player: IPlayer): { mp: number; faith: number } {
  const mpCost = Math.floor(card.mpCost * player.mpCostMultiplier);
  const faithCost = card.faithCost || 0;
  
  return { mp: mpCost, faith: faithCost };
}

/**
 * デバッグ用：プレイヤーの状態詳細を取得
 */
export function getPlayerStatusDebugInfo(player: IPlayer) {
  return {
    id: player.id,
    name: player.name,
    resources: {
      hp: `${player.hp}/${player.maxHp}`,
      mp: `${player.mp}/${player.maxMp}`,
      faith: `${player.faith}/${player.maxFaith}`,
      combo: `${player.combo}/${player.maxCombo}`
    },
    statusEffects: Array.from(player.status.entries()).map(([effect, duration]) => ({
      effect,
      duration,
      config: STATUS_EFFECT_CONFIG[effect]
    })),
    modifiers: {
      damageMultiplier: player.damageMultiplier,
      mpCostMultiplier: player.mpCostMultiplier,
      damageReceivedMultiplier: player.damageReceivedMultiplier
    },
    effectiveHp: calculateEffectiveHp(player),
    canAct: !hasStatusEffect(player, StatusEffectType.STUN) && 
            !hasStatusEffect(player, StatusEffectType.PARALYZE)
  };
}