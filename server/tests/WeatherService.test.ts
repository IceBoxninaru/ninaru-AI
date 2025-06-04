import { WeatherService } from '../services/WeatherService';
import { Player, WeatherType, ElementType } from '../../shared/types/game';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let mockPlayer: Player;

  beforeEach(() => {
    weatherService = new WeatherService();
    mockPlayer = {
      id: 'test',
      name: 'Test Player',
      hp: 2000,
      maxHp: 2000,
      mp: 100,
      maxMp: 100,
      gold: 1000,
      faith: 0,
      hand: [],
      deck: [],
      discardPile: [],
      status: new Map(),
      mpCostMultiplier: 1,
      damageMultiplier: 1,
      damageReceivedMultiplier: 1,
      combo: 0,
      maxCombo: 0
    };
  });

  describe('天候効果テスト', () => {
    it('呪いの雨は呪い属性を強化する', () => {
      const modifier = weatherService.getElementModifier('curse', 'curse');
      expect(modifier).toBe(1.2);
    });

    it('呪いの雨は神聖属性を弱体化する', () => {
      const modifier = weatherService.getElementModifier('curse', 'holy');
      expect(modifier).toBe(0.8);
    });

    it('通常天候は属性補正なし', () => {
      const modifier = weatherService.getElementModifier('none', 'fire');
      expect(modifier).toBe(1);
    });

    it('天罰は全属性を強化する', () => {
      const elements: ElementType[] = ['curse', 'holy', 'thunder', 'fire', 'ice', 'poison', 'none'];
      elements.forEach(element => {
        const modifier = weatherService.getElementModifier('punishment', element);
        if (element !== 'none') {
          expect(modifier).toBe(1.2);
        } else {
          expect(modifier).toBe(1);
        }
      });
    });
  });

  describe('天候効果の適用テスト', () => {
    it('炎熱地獄でターン終了時にダメージを受ける', () => {
      const initialHp = mockPlayer.hp;
      weatherService.applyWeatherEffects('fire', [mockPlayer], 'end');
      expect(mockPlayer.hp).toBeLessThan(initialHp);
    });

    it('神聖なる光でターン開始時にMPが回復する', () => {
      mockPlayer.mp = 50;
      weatherService.applyWeatherEffects('holy', [mockPlayer], 'start');
      expect(mockPlayer.mp).toBeGreaterThan(50);
    });
  });

  describe('天候変化テスト', () => {
    it('120ターン以降は天罰になる', () => {
      const weather = weatherService.getNextWeather('none', 120);
      expect(weather).toBe('punishment');
    });

    it('通常の天候変化は40%の確率で発生', () => {
      const weathers = new Set<WeatherType>();
      for (let i = 0; i < 100; i++) {
        weathers.add(weatherService.getNextWeather('none', 1));
      }
      expect(weathers.size).toBeGreaterThan(1);
    });
  });
});