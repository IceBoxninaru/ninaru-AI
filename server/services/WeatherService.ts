import { WeatherType, Player, ElementType } from '../../shared/types/game';

interface WeatherEffect {
  name: string;
  description: string;
  onTurnStart?: (player: Player) => void;
  onTurnEnd?: (player: Player) => void;
  elementBonus?: ElementType[];
  elementPenalty?: ElementType[];
}

export class WeatherService {
  private readonly weatherEffects: Record<WeatherType, WeatherEffect> = {
    curse: {
      name: '呪いの雨',
      description: 'ターン終了時にHPが減少し、呪い属性が強化される',
      onTurnEnd: (player) => {
        player.hp = Math.max(0, player.hp - 50);
      },
      elementBonus: ['curse'],
      elementPenalty: ['holy']
    },
    holy: {
      name: '神聖なる光',
      description: 'ターン開始時にMPが回復し、神聖属性が強化される',
      onTurnStart: (player) => {
        player.mp = Math.min(300, player.mp + 30);
      },
      elementBonus: ['holy'],
      elementPenalty: ['curse']
    },
    thunder: {
      name: '雷雨',
      description: '雷属性が強化され、氷属性が弱体化する',
      elementBonus: ['thunder'],
      elementPenalty: ['ice']
    },
    fire: {
      name: '炎熱地獯',
      description: '火属性が強化され、氷属性が弱体化する',
      onTurnEnd: (player) => {
        if (player.status.has('burn')) {
          player.hp = Math.max(0, player.hp - 30);
        }
      },
      elementBonus: ['fire'],
      elementPenalty: ['ice']
    },
    ice: {
      name: '氷雪',
      description: '氷属性が強化され、火属性が弱体化する',
      onTurnStart: (player) => {
        player.mp = Math.max(0, player.mp - 10);
      },
      elementBonus: ['ice'],
      elementPenalty: ['fire']
    },
    poison: {
      name: '毒霧',
      description: '毒属性が強化され、神聖属性が弱体化する',
      onTurnEnd: (player) => {
        if (player.status.has('poison')) {
          player.hp = Math.max(0, player.hp - 70);
        }
      },
      elementBonus: ['poison'],
      elementPenalty: ['holy']
    },
    divine: {
      name: '天罰',
      description: '全ての属性が強化され、ランダムな効果が発生する',
      onTurnStart: (player) => {
        const effects = ['hp', 'mp', 'gold', 'faith'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        const amount = Math.floor(Math.random() * 100) - 50;

        switch (effect) {
          case 'hp':
            player.hp = Math.max(0, Math.min(2000, player.hp + amount));
            break;
          case 'mp':
            player.mp = Math.max(0, Math.min(300, player.mp + amount));
            break;
          case 'gold':
            player.gold = Math.max(0, player.gold + amount);
            break;
          case 'faith':
            player.faith = Math.max(0, player.faith + Math.floor(amount / 10));
            break;
        }
      },
      elementBonus: ['curse', 'holy', 'thunder', 'fire', 'ice', 'poison'],
      elementPenalty: []
    },
    none: {
      name: '通常',
      description: '特に効果なし',
      elementBonus: [],
      elementPenalty: []
    },
    punishment: {
      name: '天罰',
      description: '全てのプレイヤーにダメージ',
      onTurnEnd: (player) => {
        player.hp = Math.max(0, player.hp - 100);
      },
      elementBonus: ['curse', 'holy', 'thunder', 'fire', 'ice', 'poison'],
      elementPenalty: []
    }
  };

  getWeatherEffect(weather: WeatherType): WeatherEffect {
    const effect = this.weatherEffects[weather];
    if (!effect) {
      return this.weatherEffects.none;
    }
    return effect;
  }

  applyWeatherEffects(weather: WeatherType, players: Player[], phase: 'start' | 'end'): void {
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

  getElementModifier(weather: WeatherType, element: ElementType): number {
    const effect = this.getWeatherEffect(weather);
    
    if (effect.elementBonus?.includes(element)) return 1.2;
    if (effect.elementPenalty?.includes(element)) return 0.8;
    return 1;
  }

  getNextWeather(currentWeather: WeatherType, turn: number): WeatherType {
    if (turn >= 120) return 'punishment';

    const weathers: WeatherType[] = ['curse', 'holy', 'thunder', 'fire', 'ice', 'poison', 'none'];
    const currentIndex = weathers.indexOf(currentWeather);

    if (Math.random() < 0.4) {
      return currentWeather;
    }

    const nextIndex = (currentIndex + 1) % weathers.length;
    return weathers[nextIndex];
  }
} 