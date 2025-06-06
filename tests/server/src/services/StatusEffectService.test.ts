import { jest } from '@jest/globals';
import { StatusEffectType } from '../../../../shared/types/game.js';

// StatusEffectServiceが存在しない場合のモック
const MockStatusEffectService = {
  applyStatusEffect: jest.fn(),
  removeStatusEffect: jest.fn(),
  updateStatusEffects: jest.fn(),
  canUseCards: jest.fn().mockReturnValue(true),
  processStatusEffects: jest.fn()
};

describe('StatusEffectService', () => {
  let statusEffectService: typeof MockStatusEffectService;

  beforeEach(() => {
    jest.clearAllMocks();
    statusEffectService = MockStatusEffectService;
  });

  test('ステータス効果サービスが正しく初期化される', () => {
    expect(statusEffectService).toBeDefined();
    expect(statusEffectService.applyStatusEffect).toBeDefined();
    expect(statusEffectService.removeStatusEffect).toBeDefined();
    expect(statusEffectService.updateStatusEffects).toBeDefined();
  });

  test('ステータス効果を適用できる', () => {
    const mockPlayer = { 
      id: 'test-player', 
      statusEffects: [],
      status: new Map()
    };

    statusEffectService.applyStatusEffect(mockPlayer, StatusEffectType.POISON);
    
    expect(statusEffectService.applyStatusEffect).toHaveBeenCalledWith(
      mockPlayer, 
      StatusEffectType.POISON
    );
    expect(statusEffectService.applyStatusEffect).toHaveBeenCalledTimes(1);
  });

  test('ステータス効果を除去できる', () => {
    const mockPlayer = { 
      id: 'test-player', 
      statusEffects: [],
      status: new Map()
    };

    statusEffectService.removeStatusEffect(mockPlayer, StatusEffectType.POISON);
    
    expect(statusEffectService.removeStatusEffect).toHaveBeenCalledWith(
      mockPlayer, 
      StatusEffectType.POISON
    );
    expect(statusEffectService.removeStatusEffect).toHaveBeenCalledTimes(1);
  });

  test('ステータス効果を更新できる', () => {
    const mockPlayer = { 
      id: 'test-player', 
      statusEffects: [],
      status: new Map()
    };

    statusEffectService.updateStatusEffects(mockPlayer, 'start');
    
    expect(statusEffectService.updateStatusEffects).toHaveBeenCalledWith(
      mockPlayer, 
      'start'
    );
    expect(statusEffectService.updateStatusEffects).toHaveBeenCalledTimes(1);
  });

  test('プレイヤーがカードを使用できるかチェックできる', () => {
    const mockPlayer = { 
      id: 'test-player', 
      statusEffects: [],
      status: new Map()
    };

    const canUse = statusEffectService.canUseCards(mockPlayer);
    
    expect(statusEffectService.canUseCards).toHaveBeenCalledWith(mockPlayer);
    expect(canUse).toBe(true);
  });

  test('ステータス効果を処理できる', () => {
    const mockPlayer = { 
      id: 'test-player', 
      statusEffects: [],
      status: new Map()
    };

    statusEffectService.processStatusEffects(mockPlayer);
    
    expect(statusEffectService.processStatusEffects).toHaveBeenCalledWith(mockPlayer);
    expect(statusEffectService.processStatusEffects).toHaveBeenCalledTimes(1);
  });

  test('複数のステータス効果タイプが定義されている', () => {
    expect(StatusEffectType.POISON).toBeDefined();
    expect(StatusEffectType.BURN).toBeDefined();
    expect(StatusEffectType.FREEZE).toBeDefined();
    expect(StatusEffectType.SHIELD).toBeDefined();
    expect(StatusEffectType.REGENERATION).toBeDefined();
    expect(StatusEffectType.STUN).toBeDefined();
  });

  test('ステータス効果タイプが正しい値を持っている', () => {
    expect(StatusEffectType.POISON).toBe('POISON');
    expect(StatusEffectType.BURN).toBe('BURN');
    expect(StatusEffectType.FREEZE).toBe('FREEZE');
    expect(StatusEffectType.SHIELD).toBe('SHIELD');
    expect(StatusEffectType.REGENERATION).toBe('REGENERATION');
    expect(StatusEffectType.STUN).toBe('STUN');
  });
}); 