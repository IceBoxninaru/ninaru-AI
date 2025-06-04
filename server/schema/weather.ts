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
  duration: number;
}

export const WEATHER_CONFIG: Record<WeatherKind, WeatherConfig> = {
  [WeatherKind.SUNNY]: {
    name: '晴天',
    description: '火属性と光属性の威力が上昇し、水属性と闇属性の威力が低下する',
    duration: 3,
    bonus: {
      [ElementKind.FIRE]: true,
      [ElementKind.LIGHT]: true
    },
    penalty: {
      [ElementKind.WATER]: true,
      [ElementKind.DARK]: true
    }
  },
  [WeatherKind.RAINY]: {
    name: '雨天',
    description: '水属性と地属性の威力が上昇し、火属性と風属性の威力が低下する',
    duration: 3,
    effect: StatusEffectType.FREEZE,
    effectChance: 0.2,
    bonus: {
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: true
    },
    penalty: {
      [ElementKind.FIRE]: true,
      [ElementKind.WIND]: true
    }
  },
  [WeatherKind.STORMY]: {
    name: '嵐',
    description: '風属性と闇属性の威力が上昇し、地属性と光属性の威力が低下する',
    duration: 4,
    effect: StatusEffectType.STUN,
    effectChance: 0.15,
    bonus: {
      [ElementKind.WIND]: true,
      [ElementKind.DARK]: true
    },
    penalty: {
      [ElementKind.EARTH]: true,
      [ElementKind.LIGHT]: true
    }
  },
  [WeatherKind.SNOWY]: {
    name: '雪',
    description: '水属性と地属性が強化され、火属性と風属性が弱体化します。',
    duration: 2,
    effect: StatusEffectType.FREEZE,
    effectChance: 0.3,
    bonus: {
      [ElementKind.WATER]: true,
      [ElementKind.EARTH]: true
    },
    penalty: {
      [ElementKind.FIRE]: true,
      [ElementKind.WIND]: true
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
    description: '闇属性が強化され、光属性が弱体化します。',
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
    description: '光属性が強化され、闇属性が弱体化します。',
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
  [WeatherKind.CLEAR]: {
    name: '快晴',
    description: '特に効果はありません。',
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
  [WeatherKind.WINDY]: {
    name: '強風',
    description: '風属性と無属性の威力が上昇し、地属性の威力が低下する',
    duration: 3,
    effect: StatusEffectType.STUN,
    effectChance: 0.1,
    bonus: {
      [ElementKind.WIND]: true,
      [ElementKind.NEUTRAL]: true
    },
    penalty: {
      [ElementKind.EARTH]: true
    }
  }
};

export const STATUS_EFFECT_CONFIG: Record<StatusEffectType, StatusEffectConfig> = {
  [StatusEffectType.BURN]: {
    name: '火傷',
    description: 'ターン開始時にHPが減少します',
    icon: '🔥',
    duration: 3
  },
  [StatusEffectType.FREEZE]: {
    name: '凍結',
    description: 'MPの回復量が減少します',
    icon: '❄️',
    duration: 2
  },
  [StatusEffectType.POISON]: {
    name: '毒',
    description: 'ターン終了時にHPが減少します',
    icon: '☠️',
    duration: 4
  },
  [StatusEffectType.STUN]: {
    name: '麻痺',
    description: 'カードを使用できない確率があります',
    icon: '⚡',
    duration: 1
  },
  [StatusEffectType.SHIELD]: {
    name: '防御',
    description: '受けるダメージが減少します',
    icon: '🛡️',
    duration: 2
  },
  [StatusEffectType.REGENERATION]: {
    name: '再生',
    description: 'ターン開始時にHPが回復します',
    icon: '💚',
    duration: 3
  },
  [StatusEffectType.REGEN]: {
    name: '回復',
    description: 'ターン開始時にHPが回復します',
    icon: '💖',
    duration: 2
  },
  [StatusEffectType.CURSE]: {
    name: '呪い',
    description: '与えるダメージが減少します',
    icon: '👻'
  },
  [StatusEffectType.BLESS]: {
    name: '祝福',
    description: '回復効果が増加します',
    icon: '✨'
  },
  [StatusEffectType.RAGE]: {
    name: '激怒',
    description: '与えるダメージが増加します',
    icon: '😠'
  },
  [StatusEffectType.PURIFY]: {
    name: '浄化',
    description: '回復効果が減少します',
    icon: '✝️'
  },
  [StatusEffectType.PARALYZE]: {
    name: '麻痺',
    description: '行動が制限されます',
    icon: '⚡'
  }
};