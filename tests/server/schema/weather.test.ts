import { WEATHER_CONFIG, STATUS_EFFECT_CONFIG } from '../../../server/schema/weather';
import { WeatherKind, ElementKind, StatusEffectType } from '../../../shared/types/game';

describe('天候システム', () => {
  describe('天候設定', () => {
    it('すべての天候が必要な属性を持っている', () => {
      Object.values(WEATHER_CONFIG).forEach(weather => {
        expect(weather).toHaveProperty('name');
        expect(weather).toHaveProperty('description');
        expect(weather).toHaveProperty('duration');
        expect(weather).toHaveProperty('bonus');
        expect(weather).toHaveProperty('penalty');
      });
    });

    it('各天候のボーナスとペナルティが正しく設定されている', () => {
      Object.values(WEATHER_CONFIG).forEach(weather => {
        // すべての属性が含まれているか確認
        const elements = Object.values(ElementKind);
        elements.forEach(element => {
          expect(weather.bonus).toHaveProperty(element);
          expect(weather.penalty).toHaveProperty(element);
        });

        // ボーナスとペナルティが同時に適用されていないか確認
        elements.forEach(element => {
          expect(weather.bonus[element] && weather.penalty[element]).toBe(false);
        });
      });
    });

    it('天候効果が正しく設定されている', () => {
      Object.entries(WEATHER_CONFIG).forEach(([weatherType, config]) => {
        if (config.effect) {
          expect(config).toHaveProperty('effectChance');
          expect(config.effectChance).toBeGreaterThan(0);
          expect(config.effectChance).toBeLessThanOrEqual(1);
          expect(STATUS_EFFECT_CONFIG).toHaveProperty(config.effect);
        }
      });
    });

    it('天候の持続時間が適切な範囲内である', () => {
      Object.values(WEATHER_CONFIG).forEach(weather => {
        expect(weather.duration).toBeGreaterThan(0);
        expect(weather.duration).toBeLessThanOrEqual(5); // 最大5ターンを想定
      });
    });
  });

  describe('状態異常設定', () => {
    it('すべての状態異常が必要な属性を持っている', () => {
      Object.values(STATUS_EFFECT_CONFIG).forEach(effect => {
        expect(effect).toHaveProperty('name');
        expect(effect).toHaveProperty('description');
        expect(effect).toHaveProperty('icon');
        expect(effect).toHaveProperty('duration');
      });
    });

    it('状態異常のアイコンが設定されている', () => {
      Object.values(STATUS_EFFECT_CONFIG).forEach(effect => {
        expect(effect.icon).toBeTruthy();
        expect(typeof effect.icon).toBe('string');
      });
    });
  });

  describe('天候の相互作用', () => {
    it('対立する天候効果が存在する', () => {
      const weatherPairs = [
        [WeatherKind.SUNNY, WeatherKind.RAINY],
        [WeatherKind.CLOUDY, WeatherKind.WINDY]
      ];

      weatherPairs.forEach(([weather1, weather2]) => {
        const config1 = WEATHER_CONFIG[weather1];
        const config2 = WEATHER_CONFIG[weather2];

        // 対立する天候は逆の効果を持つはず
        Object.values(ElementKind).forEach(element => {
          if (config1.bonus[element]) {
            expect(config2.penalty[element]).toBe(true);
          }
        });
      });
    });
  });
}); 