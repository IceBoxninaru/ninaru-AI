import { WeatherKind, Player, ElementKind, StatusEffectType } from '../../shared/types/game.js';

interface WeatherEffect {
  name: string;
  description: string;
  onTurnStart?: (player: Player) => void;
  onTurnEnd?: (player: Player) => void;
  elementBonus?: ElementKind[];
  elementPenalty?: ElementKind[];
}

export class WeatherService {
  private readonly weatherEffects: Record<WeatherKind, WeatherEffect> = {
    [WeatherKind.STORMY]: {
      name: '嵐',
      description: 'ターン終了時にHPが減少し、闇属性が強化される',
      onTurnEnd: (player) => {
        player.hp = Math.max(0, player.hp - 50);
      },
      elementBonus: [ElementKind.DARK],
      elementPenalty: [ElementKind.LIGHT]
    },
    [WeatherKind.SACRED]: {
      name: '神聖なる光',
      description: 'ターン開始時にMPが回復し、光属性が強化される',
      onTurnStart: (player) => {
        player.mp = Math.min(300, player.mp + 30);
      },
      elementBonus: [ElementKind.LIGHT],
      elementPenalty: [ElementKind.DARK]
    },
    [WeatherKind.WINDY]: {
      name: '強風',
      description: '風属性が強化され、地属性が弱体化する',
      elementBonus: [ElementKind.WIND],
      elementPenalty: [ElementKind.EARTH]
    },
    [WeatherKind.SNOWY]: {
      name: '吹雪',
      description: '水属性が強化され、火属性が弱体化する',
      onTurnEnd: (player) => {
        if (player.status.has(StatusEffectType.BURN)) {
          player.hp = Math.max(0, player.hp - 30);
        }
      },
      elementBonus: [ElementKind.WATER],
      elementPenalty: [ElementKind.FIRE]
    },
    [WeatherKind.FOGGY]: {
      name: '霧',
      description: '闇属性が強化され、光属性が弱体化する',
      onTurnEnd: (player) => {
        if (player.status.has(StatusEffectType.POISON)) {
          player.hp = Math.max(0, player.hp - 70);
        }
      },
      elementBonus: [ElementKind.DARK],
      elementPenalty: [ElementKind.LIGHT]
    },
    [WeatherKind.SUNNY]: {
      name: '晴天',
      description: '火属性が強化され、水属性が弱体化する',
      elementBonus: [ElementKind.FIRE],
      elementPenalty: [ElementKind.WATER]
    },
    [WeatherKind.RAINY]: {
      name: '雨天',
      description: '水属性が強化され、火属性が弱体化する',
      elementBonus: [ElementKind.WATER],
      elementPenalty: [ElementKind.FIRE]
    },
    [WeatherKind.CLOUDY]: {
      name: '曇天',
      description: '特に効果なし',
      elementBonus: [],
      elementPenalty: []
    },
    [WeatherKind.CLEAR]: {
      name: '快晴',
      description: '特に効果なし',
      elementBonus: [],
      elementPenalty: []
    }
  };

  getWeatherEffect(weather: WeatherKind): WeatherEffect {
    const effect = this.weatherEffects[weather];
    if (!effect) {
      return this.weatherEffects[WeatherKind.CLEAR];
    }
    return effect;
  }

  applyWeatherEffects(weather: WeatherKind, players: Player[], phase: 'start' | 'end'): void {
    const effect = this.getWeatherEffect(weather);
    
    players.forEach(player => {
      if (!player) return;
      
      if (phase === 'start' && effect.onTurnStart) {
        effect.onTurnStart(player);
      } else if (phase === 'end' && effect.onTurnEnd) {
        effect.onTurnEnd(player);
      }
    });
  }

  getElementModifier(weather: WeatherKind, element: ElementKind): number {
    const effect = this.getWeatherEffect(weather);
    
    if (effect.elementBonus?.includes(element)) return 1.2;
    if (effect.elementPenalty?.includes(element)) return 0.8;
    return 1;
  }

  getNextWeather(currentWeather: WeatherKind, turn: number): WeatherKind {
    if (turn >= 120) return WeatherKind.SACRED;

    const weathers = [
      WeatherKind.STORMY,
      WeatherKind.SACRED,
      WeatherKind.WINDY,
      WeatherKind.SNOWY,
      WeatherKind.FOGGY,
      WeatherKind.SUNNY,
      WeatherKind.RAINY,
      WeatherKind.CLOUDY,
      WeatherKind.CLEAR
    ];
    const currentIndex = weathers.indexOf(currentWeather);

    if (Math.random() < 0.4) {
      return currentWeather;
    }

    const nextIndex = (currentIndex + 1) % weathers.length;
    return weathers[nextIndex];
  }
} 