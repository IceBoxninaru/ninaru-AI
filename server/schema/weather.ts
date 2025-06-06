import {
  WeatherKind,
  StatusEffectType,
  ElementKind,
  IWeatherConfig,
  IStatusEffectConfig,
  IElementConfig
} from '../../shared/types/game.js';

// ===== WEATHER CONFIGURATIONS =====

export const WEATHER_CONFIG: Record<WeatherKind, IWeatherConfig> = {
  [WeatherKind.CLEAR]: {
    name: '快晴',
    description: '特に効果はありません。すべての属性が等しく扱われます。',
    duration: 3,
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

  [WeatherKind.SUNNY]: {
    name: '晴天',
    description: '火属性と光属性の威力が上昇し、水属性と闇属性の威力が低下します。',
    duration: 3,
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
    description: '水属性と地属性の威力が上昇し、火属性と風属性の威力が低下します。',
    duration: 3,
    effect: StatusEffectType.FREEZE,
    effectChance: 0.2,
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

  [WeatherKind.STORMY]: {
    name: '嵐',
    description: '風属性と闇属性の威力が上昇し、地属性と光属性の威力が低下します。',
    duration: 4,
    effect: StatusEffectType.STUN,
    effectChance: 0.15,
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

  [WeatherKind.SNOWY]: {
    name: '雪',
    description: '水属性と地属性が強化され、火属性と風属性が弱体化します。凍結効果が発生しやすくなります。',
    duration: 2,
    effect: StatusEffectType.FREEZE,
    effectChance: 0.3,
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
    name: '曇り',
    description: '全ての属性の威力が若干低下します。',
    duration: 2,
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
  },

  [WeatherKind.FOGGY]: {
    name: '霧',
    description: '闇属性が強化され、光属性が弱体化します。毒効果が発生しやすくなります。',
    duration: 2,
    effect: StatusEffectType.POISON,
    effectChance: 0.2,
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

  [WeatherKind.SACRED]: {
    name: '神聖',
    description: '光属性が強化され、闇属性が弱体化します。再生効果が発生しやすくなります。',
    duration: 2,
    effect: StatusEffectType.REGENERATION,
    effectChance: 0.25,
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

  [WeatherKind.WINDY]: {
    name: '強風',
    description: '風属性と無属性の威力が上昇し、地属性の威力が低下します。',
    duration: 3,
    effect: StatusEffectType.STUN,
    effectChance: 0.1,
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
  }
};

// ===== STATUS EFFECT CONFIGURATIONS =====

export const STATUS_EFFECT_CONFIG: Record<StatusEffectType, IStatusEffectConfig> = {
  [StatusEffectType.BURN]: {
    name: '炎上',
    description: 'ターン終了時にHPが減少します',
    icon: '🔥',
    duration: 3,
    color: '#ff4500'
  },

  [StatusEffectType.FREEZE]: {
    name: '凍結',
    description: 'MPコストが50%増加します',
    icon: '❄️',
    duration: 2,
    color: '#00ffff'
  },

  [StatusEffectType.POISON]: {
    name: '毒',
    description: 'ターン終了時にHPが大きく減少します',
    icon: '☠️',
    duration: 4,
    color: '#800080'
  },

  [StatusEffectType.STUN]: {
    name: '麻痺',
    description: 'カードを使用できません',
    icon: '⚡',
    duration: 1,
    color: '#ffd700'
  },

  [StatusEffectType.PARALYZE]: {
    name: '麻痺',
    description: '行動が制限されます',
    icon: '⚡',
    duration: 1,
    color: '#ffd700'
  },

  [StatusEffectType.SHIELD]: {
    name: '防御',
    description: '受けるダメージが50%減少します',
    icon: '🛡️',
    duration: 2,
    color: '#4169e1'
  },

  [StatusEffectType.REGENERATION]: {
    name: '再生',
    description: 'ターン開始時にHPが回復します',
    icon: '💚',
    duration: 3,
    color: '#32cd32'
  },

  [StatusEffectType.REGEN]: {
    name: '再生',
    description: 'ターン開始時にHPが回復します',
    icon: '💚',
    duration: 3,
    color: '#32cd32'
  },

  [StatusEffectType.CURSE]: {
    name: '呪い',
    description: '与えるダメージが25%減少します',
    icon: '👻',
    duration: 3,
    color: '#4b0082'
  },

  [StatusEffectType.BLESS]: {
    name: '祝福',
    description: '回復効果が50%増加します',
    icon: '✨',
    duration: 2,
    color: '#ffd700'
  },

  [StatusEffectType.RAGE]: {
    name: '激怒',
    description: '与えるダメージが25%増加します',
    icon: '😠',
    duration: 2,
    color: '#dc143c'
  },

  [StatusEffectType.PURIFY]: {
    name: '浄化',
    description: '負の効果を無効化します',
    icon: '✝️',
    duration: 1,
    color: '#ffffff'
  }
};

// ===== ELEMENT CONFIGURATIONS =====

export const ELEMENT_CONFIG: Record<ElementKind, IElementConfig> = {
  [ElementKind.FIRE]: {
    name: '火',
    icon: '🔥',
    color: '#ff4500'
  },
  [ElementKind.WATER]: {
    name: '水',
    icon: '💧',
    color: '#00ffff'
  },
  [ElementKind.EARTH]: {
    name: '地',
    icon: '🌍',
    color: '#8b4513'
  },
  [ElementKind.WIND]: {
    name: '風',
    icon: '🌪️',
    color: '#98fb98'
  },
  [ElementKind.LIGHT]: {
    name: '光',
    icon: '✨',
    color: '#ffd700'
  },
  [ElementKind.DARK]: {
    name: '闇',
    icon: '🌑',
    color: '#800080'
  },
  [ElementKind.NEUTRAL]: {
    name: '無',
    icon: '⚪',
    color: '#808080'
  }
};

// ===== WEATHER UTILITY FUNCTIONS =====

/**
 * ランダムな天候を生成する
 */
export const generateRandomWeather = (): WeatherKind => {
  const weatherTypes = Object.values(WeatherKind);
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
};

/**
 * 現在の天候と異なる天候を生成する
 */
export const generateDifferentWeather = (currentWeather: WeatherKind): WeatherKind => {
  const weatherTypes = Object.values(WeatherKind).filter(w => w !== currentWeather);
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
};

/**
 * 天候による属性ダメージの修正値を計算する
 */
export const calculateWeatherModifier = (element: ElementKind, weather: WeatherKind): number => {
  const config = WEATHER_CONFIG[weather];
  
  if (config.bonus[element]) {
    return 1.5; // 50%増加
  }
  if (config.penalty[element]) {
    return 0.7; // 30%減少
  }
  if (weather === WeatherKind.CLOUDY) {
    return 0.9; // 曇りの場合、全属性10%減少
  }
  
  return 1.0; // 変化なし
};

/**
 * 天候効果のステータス効果発生をチェックする
 */
export const checkWeatherStatusEffect = (weather: WeatherKind): StatusEffectType | null => {
  const config = WEATHER_CONFIG[weather];
  
  if (config.effect && config.effectChance) {
    if (Math.random() < config.effectChance) {
      return config.effect;
    }
  }
  
  return null;
};

/**
 * ステータス効果による値の計算
 */
export const calculateStatusEffectValue = (
  effectType: StatusEffectType,
  baseValue: number,
  maxHp?: number
): number => {
  switch (effectType) {
    case StatusEffectType.BURN:
      return maxHp ? Math.floor(maxHp * 0.03) : 3; // 最大HPの3%
    
    case StatusEffectType.POISON:
      return maxHp ? Math.floor(maxHp * 0.05) : 5; // 最大HPの5%
    
    case StatusEffectType.REGENERATION:
      return maxHp ? Math.floor(maxHp * 0.1) : 10; // 最大HPの10%
    
    case StatusEffectType.SHIELD:
      return Math.floor(baseValue * 0.5); // 50%軽減
    
    case StatusEffectType.CURSE:
      return Math.floor(baseValue * 0.75); // 25%減少
    
    case StatusEffectType.RAGE:
      return Math.floor(baseValue * 1.25); // 25%増加
    
    case StatusEffectType.FREEZE:
      return Math.floor(baseValue * 1.5); // MPコスト50%増加
    
    case StatusEffectType.BLESS:
      return Math.floor(baseValue * 1.5); // 回復効果50%増加
    
    default:
      return baseValue;
  }
};

/**
 * 天候の持続時間を更新する
 */
export const updateWeatherDuration = (weather: { type: WeatherKind; duration: number }): boolean => {
  weather.duration--;
  return weather.duration <= 0;
};

/**
 * 相性の良い天候を取得する（特定の属性にとって）
 */
export const getFavorableWeathers = (element: ElementKind): WeatherKind[] => {
  return Object.entries(WEATHER_CONFIG)
    .filter(([_, config]) => config.bonus[element])
    .map(([weather, _]) => weather as WeatherKind);
};

/**
 * 相性の悪い天候を取得する（特定の属性にとって）
 */
export const getUnfavorableWeathers = (element: ElementKind): WeatherKind[] => {
  return Object.entries(WEATHER_CONFIG)
    .filter(([_, config]) => config.penalty[element])
    .map(([weather, _]) => weather as WeatherKind);
};

/**
 * ステータス効果が互いに打ち消すかをチェックする
 */
export const checkStatusEffectCancellation = (
  effect1: StatusEffectType,
  effect2: StatusEffectType
): boolean => {
  const cancellationPairs = [
    [StatusEffectType.BURN, StatusEffectType.FREEZE],
    [StatusEffectType.CURSE, StatusEffectType.BLESS],
    [StatusEffectType.POISON, StatusEffectType.REGENERATION]
  ];
  
  return cancellationPairs.some(pair => 
    (pair[0] === effect1 && pair[1] === effect2) ||
    (pair[0] === effect2 && pair[1] === effect1)
  );
};

/**
 * デバッグ用：全ての設定情報を取得
 */
export const getDebugInfo = () => {
  return {
    weatherCount: Object.keys(WEATHER_CONFIG).length,
    statusEffectCount: Object.keys(STATUS_EFFECT_CONFIG).length,
    elementCount: Object.keys(ELEMENT_CONFIG).length,
    weatherTypes: Object.keys(WEATHER_CONFIG),
    statusEffects: Object.keys(STATUS_EFFECT_CONFIG),
    elements: Object.keys(ELEMENT_CONFIG)
  };
};