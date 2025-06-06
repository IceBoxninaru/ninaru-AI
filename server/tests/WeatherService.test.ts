import { jest } from '@jest/globals';
import { WeatherService } from '../services/WeatherService.js';
import { Player, WeatherKind, ElementKind, StatusEffectType } from '../../shared/types/game.js';

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
      maxFaith: 100,
      hand: [],
      deck: [],
      discardPile: [],
      statusEffects: [],
      status: new Map<StatusEffectType, number>(),
      mpCostMultiplier: 1,
      damageMultiplier: 1,
      damageReceivedMultiplier: 1,
      combo: 0,
      maxCombo: 0,
      drawCard: jest.fn().mockReturnValue(null),
      playCard: jest.fn().mockReturnValue(true),
      canPlayCard: jest.fn().mockReturnValue(true),
      takeDamage: jest.fn(),
      heal: jest.fn(),
      addStatus: jest.fn(),
      removeStatus: jest.fn(),
      hasStatusEffect: jest.fn().mockReturnValue(false),
      updateStatuses: jest.fn(),
      gainMp: jest.fn(),
      spendMp: jest.fn(),
      addFaith: jest.fn(),
      spendFaith: jest.fn(),
      isAlive: jest.fn().mockReturnValue(true),
      addCombo: jest.fn(),
      resetCombo: jest.fn(),
      isCriticalHit: jest.fn().mockReturnValue(false),
      resetForNewGame: jest.fn()
    } as unknown as Player;
  });

  describe('天候効果テスト', () => {
    it('呪いの雨は呪い属性を強化する', () => {
      const modifier = weatherService.getElementModifier(WeatherKind.STORMY, ElementKind.DARK);
      expect(modifier).toBe(1.2);
    });

    it('呪いの雨は神聖属性を弱体化する', () => {
      const modifier = weatherService.getElementModifier(WeatherKind.STORMY, ElementKind.LIGHT);
      expect(modifier).toBe(0.8);
    });

    it('通常天候は属性補正なし', () => {
      const modifier = weatherService.getElementModifier(WeatherKind.CLEAR, ElementKind.FIRE);
      expect(modifier).toBe(1);
    });

    it('神聖なる光は光属性を強化し、闇属性を弱体化する', () => {
      const elements = [
        ElementKind.FIRE,
        ElementKind.WATER,
        ElementKind.EARTH,
        ElementKind.WIND,
        ElementKind.LIGHT,
        ElementKind.DARK,
        ElementKind.NEUTRAL
      ];
      elements.forEach(element => {
        const modifier = weatherService.getElementModifier(WeatherKind.SACRED, element);
        if (element === ElementKind.LIGHT) {
          expect(modifier).toBe(1.2);
        } else if (element === ElementKind.DARK) {
          expect(modifier).toBe(0.8);
        } else {
          expect(modifier).toBe(1);
        }
      });
    });
  });

  describe('天候効果の適用テスト', () => {
    it('炎熱地獄でターン終了時にダメージを受ける', () => {
      const initialHp = mockPlayer.hp;
      mockPlayer.status.set(StatusEffectType.BURN, 1);
      weatherService.applyWeatherEffects(WeatherKind.SNOWY, [mockPlayer], 'end');
      expect(mockPlayer.hp).toBeLessThan(initialHp);
    });

    it('神聖なる光でターン開始時にMPが回復する', () => {
      mockPlayer.mp = 50;
      weatherService.applyWeatherEffects(WeatherKind.SACRED, [mockPlayer], 'start');
      expect(mockPlayer.mp).toBeGreaterThan(50);
    });
  });

  describe('天候変化テスト', () => {
    it('120ターン以降は天罰になる', () => {
      const weather = weatherService.getNextWeather(WeatherKind.CLEAR, 120);
      expect(weather).toBe(WeatherKind.SACRED);
    });

    it('通常の天候変化は40%の確率で発生', () => {
      const weathers = new Set<WeatherKind>();
      for (let i = 0; i < 100; i++) {
        weathers.add(weatherService.getNextWeather(WeatherKind.CLEAR, 1));
      }
      expect(weathers.size).toBeGreaterThan(1);
    });
  });
});