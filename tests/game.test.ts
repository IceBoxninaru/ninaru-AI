import { Game } from '../server/src/game';
import { Player } from '../server/src/player';
import { WeatherKind, ElementKind, StatusEffectType } from '../shared/types/game';

describe('Game', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    game = new Game();
    player1 = new Player('player1', 'Player 1');
    player2 = new Player('player2', 'Player 2');
    game.addPlayer(player1);
    game.addPlayer(player2);
  });

  describe('初期化', () => {
    it('プレイヤーが正しく追加されている', () => {
      expect(game.getPlayers().length).toBe(2);
      expect(game.getPlayers()[0].id).toBe('player1');
      expect(game.getPlayers()[1].id).toBe('player2');
    });

    it('初期デッキが正しく設定されている', () => {
      const player = game.getPlayers()[0];
      expect(player.deck.length).toBeGreaterThan(0);
      expect(player.hand.length).toBe(5); // 初期手札
    });
  });

  describe('ターン管理', () => {
    it('正しい順序でターンが進行する', () => {
      const firstPlayer = game.getCurrentPlayer();
      game.endTurn();
      expect(game.getCurrentPlayer()).not.toBe(firstPlayer);
      game.endTurn();
      expect(game.getCurrentPlayer()).toBe(firstPlayer);
    });
  });

  describe('カード使用', () => {
    it('MPが足りない場合はカードを使用できない', () => {
      const player = game.getCurrentPlayer();
      const card = {
        id: 'test-card',
        name: 'Test Card',
        mpCost: 999,
        element: ElementKind.FIRE
      };
      expect(() => game.playCard(player.id, card)).toThrow();
    });

    it('正しくダメージが計算される', () => {
      const attacker = game.getCurrentPlayer();
      const defender = game.getPlayers().find(p => p.id !== attacker.id)!;
      const initialHp = defender.hp;
      const card = {
        id: 'attack-card',
        name: 'Attack Card',
        mpCost: 1,
        power: 10,
        element: ElementKind.FIRE
      };
      
      game.playCard(attacker.id, card);
      expect(defender.hp).toBeLessThan(initialHp);
    });
  });

  describe('天候効果', () => {
    it('天候が属性ダメージに影響する', () => {
      game.setWeather({ type: WeatherKind.SUNNY, duration: 3 });
      const attacker = game.getCurrentPlayer();
      const defender = game.getPlayers().find(p => p.id !== attacker.id)!;
      
      const fireCard = {
        id: 'fire-card',
        name: 'Fire Card',
        mpCost: 1,
        power: 10,
        element: ElementKind.FIRE
      };
      
      const waterCard = {
        id: 'water-card',
        name: 'Water Card',
        mpCost: 1,
        power: 10,
        element: ElementKind.WATER
      };

      const fireDamage = game.calculateDamage(fireCard.power, attacker, defender, fireCard.element);
      const waterDamage = game.calculateDamage(waterCard.power, attacker, defender, waterCard.element);

      expect(fireDamage).toBeGreaterThan(waterDamage);
    });
  });

  describe('ステータス効果', () => {
    it('毒ダメージが正しく適用される', () => {
      const player = game.getCurrentPlayer();
      const initialHp = player.hp;
      
      game.applyStatusEffect(player.id, StatusEffectType.POISON);
      game.endTurn();
      
      expect(player.hp).toBeLessThan(initialHp);
    });

    it('凍結状態でMPコストが増加する', () => {
      const player = game.getCurrentPlayer();
      game.applyStatusEffect(player.id, StatusEffectType.FREEZE);
      
      expect(player.mpCostMultiplier).toBeGreaterThan(1);
    });
  });
}); 