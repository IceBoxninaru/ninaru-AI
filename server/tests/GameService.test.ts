import { GameService } from '../src/services/GameService.js';
import {
  IPlayer,
  Card,
  GameState,
  WeatherKind,
  ElementKind,
  CardType,
  GamePhase,
  StatusEffectType,
  CardRarity
} from '../../shared/types/game.js';

describe('GameService', () => {
  let gameService: GameService;
  let gameId: string;

  beforeEach(() => {
    gameService = new GameService();
    gameId = gameService.createGame();
  });

  describe('初期化テスト', () => {
    it('ゲームの初期状態が正しく設定されている', () => {
      const gameState = gameService.getGameById(gameId);
      
      expect(gameState.players.length).toBe(0);
      expect(gameState.currentPlayerId).toBe('');
      expect(gameState.currentTurn).toBe(1);
      expect(gameState.weather.type).toBe(WeatherKind.CLEAR);
      expect(gameState.phase).toBe(GamePhase.WAIT);
      expect(gameState.winner).toBeUndefined();
    });

    it('プレイヤーの初期状態が正しく設定されている', () => {
      gameService.joinGame(gameId, 'player1', 'Player 1');
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];

      expect(player.hp).toBe(2000);
      expect(player.maxHp).toBe(2000);
      expect(player.mp).toBe(100);
      expect(player.maxMp).toBe(100);
      expect(player.gold).toBe(1000);
      expect(player.faith).toBe(0);
      expect(player.team).toBe(1);
      expect(player.combo).toBe(0);
      expect(player.maxCombo).toBe(0);
      expect(player.statusEffects.length).toBe(0);
    });
  });

  describe('カードプレイのテスト', () => {
    let player1Id: string;
    let player2Id: string;

    beforeEach(() => {
      player1Id = 'player1';
      player2Id = 'player2';
      gameService.joinGame(gameId, player1Id, 'Player 1');
      gameService.joinGame(gameId, player2Id, 'Player 2');
    });

    it('攻撃カードで正しくダメージを与えられる', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      const target = gameState.players[1];
      const initialHp = target.hp;

      const attackCard: Card = {
        id: 'test_attack',
        name: 'テスト攻撃',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: 'テスト用の攻撃カード',
        rarity: CardRarity.COMMON
      };

      player.hand.push(attackCard);
      const damageEvent = gameService.playCard(gameId, player.id, target.id, '0');

      expect(damageEvent).not.toBeNull();
      expect(target.hp).toBeLessThan(initialHp);
      expect(player.hand.length).toBe(0);
      expect(player.discardPile.length).toBe(1);
    });

    it('防御カードで正しく回復できる', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      player.hp = 1000;
      const initialHp = player.hp;

      const defenseCard: Card = {
        id: 'test_defense',
        name: 'テスト防御',
        type: CardType.DEFENSE,
        shield: 100,
        element: ElementKind.LIGHT,
        mpCost: 0,
        description: 'テスト用の防御カード',
        rarity: CardRarity.COMMON
      };

      player.hand.push(defenseCard);
      gameService.playCard(gameId, player.id, player.id, '0');

      expect(player.hp).toBeGreaterThan(initialHp);
    });

    it('MPが不足している場合はカードを使用できない', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      player.mp = 10;

      const magicCard: Card = {
        id: 'test_magic',
        name: 'テスト魔法',
        type: CardType.MAGIC,
        power: 200,
        mpCost: 50,
        element: ElementKind.WIND,
        description: 'テスト用の魔法カード',
        rarity: CardRarity.COMMON
      };

      player.hand.push(magicCard);
      
      expect(() => {
        gameService.playCard(gameId, player.id, player2Id, '0');
      }).toThrow('Not enough MP');
    });
  });

  describe('コンボシステムのテスト', () => {
    let player1Id: string;
    let player2Id: string;

    beforeEach(() => {
      player1Id = 'player1';
      player2Id = 'player2';
      gameService.joinGame(gameId, player1Id, 'Player 1');
      gameService.joinGame(gameId, player2Id, 'Player 2');
    });

    it('同じ属性のカードを連続使用するとコンボが増加する', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      const target = gameState.players[1];

      const fireCard1: Card = {
        id: 'fire1',
        name: '炎の剣1',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: 'テスト用の火属性カード1',
        rarity: CardRarity.COMMON
      };

      const fireCard2: Card = {
        id: 'fire2',
        name: '炎の剣2',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: 'テスト用の火属性カード2',
        rarity: CardRarity.COMMON
      };

      player.hand.push(fireCard1, fireCard2);
      
      gameService.playCard(gameId, player.id, target.id, '0');
      expect(player.combo).toBe(0);
      
      gameService.playCard(gameId, player.id, target.id, '0');
      expect(player.combo).toBe(1);
    });

    it('コンボ要件を満たさないカードは使用できない', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      const target = gameState.players[1];

      const comboCard: Card = {
        id: 'combo_finisher',
        name: 'コンボフィニッシャー',
        type: CardType.ATTACK,
        power: 200,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: '3コンボ以上必要な必殺技',
        rarity: CardRarity.RARE,
        requirements: {
          minCombo: 3
        }
      };

      player.hand.push(comboCard);
      player.combo = 2; // 要件を満たさないコンボ数

      expect(() => {
        gameService.playCard(gameId, player.id, target.id, '0');
      }).toThrow('Requires 3 combo to play this card');
    });

    it('コンボ数に応じてダメージが増加する', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      const target = gameState.players[1];
      const initialHp = target.hp;

      const attackCard: Card = {
        id: 'test_attack',
        name: 'テスト攻撃',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: 'テスト用の攻撃カード',
        rarity: CardRarity.COMMON
      };

      player.hand.push(attackCard);
      player.combo = 4; // 2段階のコンボボーナス（20%増加）

      gameService.playCard(gameId, player.id, target.id, '0');
      
      const expectedDamage = Math.floor(100 * 1.2); // 20%ボーナス
      expect(initialHp - target.hp).toBeGreaterThanOrEqual(expectedDamage);
    });

    it('コンボ数に応じて状態異常の持続時間が延長される', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      const target = gameState.players[1];

      const statusCard: Card = {
        id: 'poison_card',
        name: '毒の牙',
        type: CardType.MAGIC,
        mpCost: 0,
        description: '毒を付与',
        rarity: CardRarity.COMMON,
        effects: [StatusEffectType.POISON]
      };

      player.hand.push(statusCard);
      player.combo = 4; // 2段階のコンボボーナス（+2ターン）

      gameService.playCard(gameId, player.id, target.id, '0');
      
      const poisonEffect = target.statusEffects.find(effect => effect.type === StatusEffectType.POISON);
      expect(poisonEffect?.duration).toBe(4); // 基本2ターン + コンボボーナス2ターン
    });
  });

  describe('天候システムのテスト', () => {
    it('120ターン以降は天罰天候になる', () => {
      gameService.joinGame(gameId, 'player1', 'Player 1');
      gameService.joinGame(gameId, 'player2', 'Player 2');

      const gameState = gameService.getGameById(gameId);
      gameState.currentTurn = 120;

      gameService.endTurn(gameId);
      expect(gameState.weather.type).toBe(WeatherKind.SACRED);
    });
  });

  describe('ステータス効果のテスト', () => {
    let player1Id: string;
    let player2Id: string;

    beforeEach(() => {
      player1Id = 'player1';
      player2Id = 'player2';
      gameService.joinGame(gameId, player1Id, 'Player 1');
      gameService.joinGame(gameId, player2Id, 'Player 2');
    });

    it('スタン状態のプレイヤーはカードを使用できない', () => {
      const gameState = gameService.getGameById(gameId);
      const player = gameState.players[0];
      player.statusEffects.push({ type: StatusEffectType.STUN, duration: 1 });

      const card: Card = {
        id: 'test_card',
        name: 'テストカード',
        type: CardType.ATTACK,
        power: 100,
        mpCost: 0,
        description: 'テスト用のカード',
        rarity: CardRarity.COMMON
      };

      player.hand.push(card);
      
      expect(() => {
        gameService.playCard(gameId, player.id, player2Id, '0');
      }).toThrow('Player is stunned');
    });
  });
}); 