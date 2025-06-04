import { Game } from '../server/src/game';
import { Player } from '../server/src/player';
import { WeatherKind, ElementKind, StatusEffectType } from '../shared/types/game';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

// Socket.ioのモック
const mockSocket = {
  id: 'socket-id',
  emit: jest.fn(),
  on: jest.fn(),
  join: jest.fn(),
  leave: jest.fn()
} as unknown as Socket;

const mockIo = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  sockets: {
    emit: jest.fn()
  }
} as unknown as Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;

describe('Game', () => {
  let game: Game;
  let socket1: Socket;
  let socket2: Socket;

  beforeEach(() => {
    socket1 = { ...mockSocket, id: 'player1' } as Socket;
    socket2 = { ...mockSocket, id: 'player2' } as Socket;
    game = new Game(mockIo);
    game.addPlayer(socket1, 'Player 1');
    game.addPlayer(socket2, 'Player 2');
  });

  describe('初期化', () => {
    it('プレイヤーが正しく追加されている', () => {
      const state = game.getState();
      expect(state.players.length).toBe(2);
      expect(state.players[0].id).toBe('player1');
      expect(state.players[1].id).toBe('player2');
    });

    it('初期デッキが正しく設定されている', () => {
      const state = game.getState();
      const player = state.players[0];
      expect(player.deck.length).toBeGreaterThan(0);
      expect(player.hand.length).toBe(5); // 初期手札
    });
  });

  describe('ターン管理', () => {
    it('正しい順序でターンが進行する', () => {
      const state = game.getState();
      const firstPlayerId = state.currentPlayerId;
      game.endTurn(firstPlayerId);
      
      const newState = game.getState();
      expect(newState.currentPlayerId).not.toBe(firstPlayerId);
      
      game.endTurn(newState.currentPlayerId);
      const finalState = game.getState();
      expect(finalState.currentPlayerId).toBe(firstPlayerId);
    });
  });

  describe('カード使用', () => {
    it('MPが足りない場合はカードを使用できない', () => {
      const state = game.getState();
      const currentPlayerId = state.currentPlayerId;
      
      game.handleCardPlay(currentPlayerId, 0); // 無効なカードインデックス
      const newState = game.getState();
      expect(newState.players[0].hand.length).toBe(state.players[0].hand.length);
    });

    it('正しくダメージが計算される', () => {
      const state = game.getState();
      const attackerId = state.currentPlayerId;
      const defenderId = state.players.find(p => p.id !== attackerId)!.id;
      const initialHp = state.players.find(p => p.id === defenderId)!.hp;

      // 攻撃カードを使用
      game.handleCardPlay(attackerId, 0, defenderId);

      const newState = game.getState();
      const newDefenderHp = newState.players.find(p => p.id === defenderId)!.hp;
      expect(newDefenderHp).toBeLessThan(initialHp);
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