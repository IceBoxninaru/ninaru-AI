import { WeatherKind, StatusEffectType, ElementKind } from '../../shared/types/game';

interface WeatherConfig {
  name: string;
  description: string;
  duration: number;
  effect?: StatusEffectType;
  effectChance?: number;
  bonus: Partial<Record<ElementKind, boolean>>;
  penalty: Partial<Record<ElementKind, boolean>>;
}

interface StatusEffectConfig {
  name: string;
  description: string;
  icon: string;
}

export const WEATHER_CONFIG: Record<WeatherKind, WeatherConfig> = {
  SUNNY: {
    name: '晴天',
    description: '火属性と光属性の威力が上昇し、水属性と闇属性の威力が低下する',
    duration: 3,
    bonus: {
      FIRE: true,
      LIGHT: true
    },
    penalty: {
      WATER: true,
      DARK: true
    }
  },
  RAINY: {
    name: '雨天',
    description: '水属性と地属性の威力が上昇し、火属性と風属性の威力が低下する',
    duration: 3,
    effect: 'FREEZE',
    effectChance: 0.2,
    bonus: {
      WATER: true,
      EARTH: true
    },
    penalty: {
      FIRE: true,
      WIND: true
    }
  },
  STORMY: {
    name: '嵐',
    description: '風属性と闇属性の威力が上昇し、地属性と光属性の威力が低下する',
    duration: 4,
    effect: 'STUN',
    effectChance: 0.15,
    bonus: {
      WIND: true,
      DARK: true
    },
    penalty: {
      EARTH: true,
      LIGHT: true
    }
  },
  SNOWY: {
    name: '雪',
    description: '水属性と地属性が強化され、火属性と風属性が弱体化します。',
    duration: 2,
    effect: 'FREEZE',
    effectChance: 0.3,
    bonus: {
      FIRE: false,
      WATER: true,
      EARTH: true,
      WIND: false,
      LIGHT: false,
      DARK: false,
      NEUTRAL: false
    },
    penalty: {
      FIRE: true,
      WATER: false,
      EARTH: false,
      WIND: true,
      LIGHT: false,
      DARK: false,
      NEUTRAL: false
    }
  },
  FOGGY: {
    name: '霧',
    description: '闇属性が強化され、光属性が弱体化します。',
    duration: 2,
    effect: 'POISON',
    effectChance: 0.2,
    bonus: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: false,
      DARK: true,
      NEUTRAL: false
    },
    penalty: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: true,
      DARK: false,
      NEUTRAL: false
    }
  },
  SACRED: {
    name: '神聖',
    description: '光属性が強化され、闇属性が弱体化します。',
    duration: 2,
    effect: 'REGENERATION',
    effectChance: 0.25,
    bonus: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: true,
      DARK: false,
      NEUTRAL: false
    },
    penalty: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: false,
      DARK: true,
      NEUTRAL: false
    }
  },
  CLEAR: {
    name: '快晴',
    description: '特に効果はありません。',
    duration: 3,
    bonus: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: false,
      DARK: false,
      NEUTRAL: false
    },
    penalty: {
      FIRE: false,
      WATER: false,
      EARTH: false,
      WIND: false,
      LIGHT: false,
      DARK: false,
      NEUTRAL: false
    }
  },
  WINDY: {
    name: '強風',
    description: '風属性と無属性の威力が上昇し、地属性の威力が低下する',
    duration: 3,
    effect: 'STUN',
    effectChance: 0.1,
    bonus: {
      WIND: true,
      NEUTRAL: true
    },
    penalty: {
      EARTH: true
    }
  }
};

export const STATUS_EFFECT_CONFIG: Record<StatusEffectType, StatusEffectConfig> = {
  BURN: {
    name: '火傷',
    description: 'ターン開始時にHPが減少します',
    icon: '🔥'
  },
  FREEZE: {
    name: '凍結',
    description: 'MPの回復量が減少します',
    icon: '❄️'
  },
  POISON: {
    name: '毒',
    description: 'ターン終了時にHPが減少します',
    icon: '☠️'
  },
  STUN: {
    name: '麻痺',
    description: 'カードを使用できない確率があります',
    icon: '⚡'
  },
  SHIELD: {
    name: '防御',
    description: '受けるダメージが減少します',
    icon: '🛡️'
  },
  REGEN: {
    name: '再生',
    description: 'ターン開始時にHPが回復します',
    icon: '💚'
  },
  REGENERATION: {
    name: '再生',
    description: 'ターン開始時にHPが回復します',
    icon: '💚'
  },
  CURSE: {
    name: '呪い',
    description: '与えるダメージが減少します',
    icon: '👻'
  },
  BLESS: {
    name: '祝福',
    description: '回復効果が増加します',
    icon: '✨'
  },
  RAGE: {
    name: '激怒',
    description: '与えるダメージが増加します',
    icon: '😠'
  },
  PURIFY: {
    name: '浄化',
    description: '回復効果が減少します',
    icon: '✝️'
  },
  PARALYZE: {
    name: '麻痺',
    description: '行動が制限されます',
    icon: '⚡'
  }
};