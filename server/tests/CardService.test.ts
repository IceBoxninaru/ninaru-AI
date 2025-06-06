import { jest } from '@jest/globals';
import { CardService } from '../services/CardService.js';
import { Card, Player, ElementKind, CardKind, StatusEffectType, CARD_TYPES, STATUS_EFFECTS, CardRarity } from '../../shared/types/game.js';

describe('CardService', () => {
  let cardService: CardService;
  let mockPlayer: Player;

  beforeEach(() => {
    cardService = new CardService();
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
      status: new Map(),
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

  describe('デッキ生成テスト', () => {
    it('初期デッキが正しい枚数で生成される', () => {
      const deck = cardService.createInitialDeck(mockPlayer);
      expect(deck.length).toBe(10);  // COMMONカードの合計数
    });

    it('初期デッキに各種類のカードが含まれている', () => {
      const deck = cardService.createInitialDeck(mockPlayer);
      
      const attackCards = deck.filter(card => card.type === CARD_TYPES[0]);
      const defenseCards = deck.filter(card => card.type === CARD_TYPES[1]);
      const magicCards = deck.filter(card => card.type === CARD_TYPES[2]);

      expect(attackCards.length).toBe(5);  // COMMONの攻撃カード数
      expect(defenseCards.length).toBe(3);  // COMMONの防御カード数
      expect(magicCards.length).toBe(2);  // COMMONの魔法カード数
    });
  });

  describe('カード使用可否判定テスト', () => {
    it('MPが不足している場合は使用できない', () => {
      mockPlayer.mp = 10;
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'MAGIC' as CardKind,
        mpCost: 20,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      expect(cardService.canPlayCard(mockPlayer, card)).toBe(false);
    });

    it('スタン状態では使用できない', () => {
      mockPlayer.status.set('STUN' as StatusEffectType, 1);
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'ATTACK' as CardKind,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      expect(cardService.canPlayCard(mockPlayer, card)).toBe(false);
    });

    it('麻痺状態では防御カードを使用できない', () => {
      mockPlayer.status.set('POISON' as StatusEffectType, 1);
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'DEFENSE' as CardKind,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      expect(cardService.canPlayCard(mockPlayer, card)).toBe(false);
    });
  });

  describe('ダメージ計算テスト', () => {
    it('基本ダメージが正しく計算される', () => {
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'ATTACK' as CardKind,
        power: 100,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      const damage = cardService.calculateDamage(card, mockPlayer, 1);
      expect(damage).toBe(100);
    });

    it('天候補正が正しく適用される', () => {
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'ATTACK' as CardKind,
        power: 100,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      const damage = cardService.calculateDamage(card, mockPlayer, 1.2);
      expect(damage).toBe(120);
    });

    it('コンボシステムが正しく機能する', () => {
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'ATTACK' as CardKind,
        power: 100,
        element: 'FIRE' as ElementKind,
        mpCost: 10,
        rarity: 'COMMON' as CardRarity
      };

      mockPlayer.lastPlayedElement = 'FIRE' as ElementKind;
      mockPlayer.combo = 1;
      const damage = cardService.calculateDamage(card, mockPlayer, 1);
      expect(damage).toBe(120);
    });
  });

  describe('回復量計算テスト', () => {
    it('基本回復量が正しく計算される', () => {
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'DEFENSE' as CardKind,
        shield: 100,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      const heal = cardService.calculateHeal(card, mockPlayer);
      expect(heal).toBe(100);
    });

    it('祝福効果で回復量が増加する', () => {
      mockPlayer.status.set('REGEN' as StatusEffectType, 1);
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'DEFENSE' as CardKind,
        shield: 100,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      const heal = cardService.calculateHeal(card, mockPlayer);
      expect(heal).toBe(130);
    });

    it('浄化効果で回復量が減少する', () => {
      mockPlayer.status.set('POISON' as StatusEffectType, 1);
      const card: Card = {
        id: 'test',
        name: 'Test Card',
        description: 'Test Description',
        type: 'DEFENSE' as CardKind,
        shield: 100,
        mpCost: 10,
        element: 'NEUTRAL' as ElementKind,
        rarity: 'COMMON' as CardRarity
      };

      const heal = cardService.calculateHeal(card, mockPlayer);
      expect(heal).toBe(70);
    });
  });
}); 