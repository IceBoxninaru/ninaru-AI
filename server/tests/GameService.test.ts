import { GameService } from '../services/GameService';
import { Player, Card, GameState, WeatherType } from '../../shared/types/game';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    gameService = new GameService();
  });

  describe('初期化テスト', () => {
    it('ゲームの初期状態が正しく設定されている', () => {
      const gameState = gameService.getGameState();
      
      expect(gameState.players.length).toBe(2);
      expect(gameState.currentPlayer).toBe(0);
      expect(gameState.turn).toBe(1);
      expect(gameState.weather).toBe('none');
      expect(gameState.phase).toBe('wait');
      expect(gameState.winner).toBeUndefined();
    });

    it('プレイヤーの初期状態が正しく設定されている', () => {
      const gameState = gameService.getGameState();
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
      expect(player.status.size).toBe(0);
    });
  });

  describe('カードプレイのテスト', () => {
    it('攻撃カードで正しくダメージを与えられる', () => {
      const gameState = gameService.getGameState();
      const player = gameState.players[0];
      const target = gameState.players[1];
      const initialHp = target.hp;

      const attackCard: Card = {
        id: 'test_attack',
        name: 'テスト攻撃',
        type: 'attack',
        power: 100,
        element: 'fire'
      };

      player.hand.push(attackCard);
      const damageEvent = gameService.playCard(player.id, 0, target.id);

      expect(damageEvent).not.toBeNull();
      expect(target.hp).toBeLessThan(initialHp);
      expect(player.hand.length).toBe(0);
      expect(player.discardPile.length).toBe(1);
    });

    it('防御カードで正しく回復できる', () => {
      const gameState = gameService.getGameState();
      const player = gameState.players[0];
      player.hp = 1000;
      const initialHp = player.hp;

      const defenseCard: Card = {
        id: 'test_defense',
        name: 'テスト防御',
        type: 'defense',
        shield: 100,
        element: 'holy'
      };

      player.hand.push(defenseCard);
      gameService.playCard(player.id, 0, player.id);

      expect(player.hp).toBeGreaterThan(initialHp);
    });

    it('MPが不足している場合はカードを使用できない', () => {
      const gameState = gameService.getGameState();
      const player = gameState.players[0];
      player.mp = 10;

      const magicCard: Card = {
        id: 'test_magic',
        name: 'テスト魔法',
        type: 'magic',
        power: 200,
        mpCost: 50,
        element: 'thunder'
      };

      player.hand.push(magicCard);
      
      expect(() => {
        gameService.playCard(player.id, 0, gameState.players[1].id);
      }).toThrow('Not enough MP');
    });
  });

  describe('コンボシステムのテスト', () => {
    it('同じ属性のカードを連続使用するとコンボが増加する', () => {
      const gameState = gameService.getGameState();
      const player = gameState.players[0];
      const target = gameState.players[1];

      const fireCard1: Card = {
        id: 'fire1',
        name: '炎の剣1',
        type: 'attack',
        power: 100,
        element: 'fire'
      };

      const fireCard2: Card = {
        id: 'fire2',
        name: '炎の剣2',
        type: 'attack',
        power: 100,
        element: 'fire'
      };

      player.hand.push(fireCard1, fireCard2);
      
      gameService.playCard(player.id, 0, target.id);
      expect(player.combo).toBe(0);
      
      gameService.playCard(player.id, 0, target.id);
      expect(player.combo).toBe(1);
    });
  });

  describe('天候システムのテスト', () => {
    it('120ターン以降は天罰天候になる', () => {
      const gameState = gameService.getGameState();
      gameState.turn = 120;

      gameService.endTurn();
      expect(gameState.weather).toBe('punishment');
    });
  });

  describe('ステータス効果のテスト', () => {
    it('スタン状態のプレイヤーはカードを使用できない', () => {
      const gameState = gameService.getGameState();
      const player = gameState.players[0];
      player.status.set('stun', 1);

      const card: Card = {
        id: 'test_card',
        name: 'テストカード',
        type: 'attack',
        power: 100
      };

      player.hand.push(card);
      
      expect(() => {
        gameService.playCard(player.id, 0, gameState.players[1].id);
      }).toThrow('Player is stunned');
    });
  });
}); 