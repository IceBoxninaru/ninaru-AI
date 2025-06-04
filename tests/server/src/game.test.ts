import { Game } from '../../../server/src/game';
import { Player } from '../../../server/src/player';
import { ICardData, IGameState, IPlayer, StatusEffectType } from '../../../shared/types/game';
import { Server } from 'socket.io';

describe('ゲームロジック', () => {
  let game: Game;
  let player1: Player;
  let player2: Player;
  let io: Server;

  beforeEach(() => {
    io = {
      sockets: new Map(),
      engine: {},
      httpServer: {},
      _parser: {},
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis()
    } as unknown as Server;

    player1 = new Player('Player 1', 'id1');
    player2 = new Player('Player 2', 'id2');
    game = new Game(io);
    game.addPlayer({ id: 'id1' } as any, 'Player 1');
    game.addPlayer({ id: 'id2' } as any, 'Player 2');
  });

  describe('ゲーム初期化', () => {
    it('ゲームが正しく初期化される', () => {
      const state = game.getState();
      expect(state.players).toHaveLength(2);
      expect(state.currentTurn).toBe(1);
      expect(state.currentPlayerId).toBe('id1');
      expect(state.weather).toBeTruthy();
    });

    it('各プレイヤーが正しい初期状態を持つ', () => {
      const state = game.getState();
      state.players.forEach(player => {
        expect(player.hp).toBe(100);
        expect(player.mp).toBe(50);
        expect(player.faith).toBe(0);
        expect(player.deck).toHaveLength(30);
        expect(player.hand).toHaveLength(5);
        expect(player.statusEffects).toEqual([]);
      });
    });
  });

  describe('ターン管理', () => {
    it('ターンが正しく切り替わる', () => {
      const initialState = game.getState();
      game.endTurn('id1');
      const newState = game.getState();

      expect(newState.currentTurn).toBe(initialState.currentTurn);
      expect(newState.currentPlayerId).toBe('id2');
    });

    it('ターン開始時にMPが回復する', () => {
      const player = game.getState().players.find(p => p.id === 'id1')!;
      player.mp = 0;
      game.endTurn('id1');
      game.endTurn('id2');
      
      const newState = game.getState();
      const updatedPlayer = newState.players.find(p => p.id === 'id1')!;
      expect(updatedPlayer.mp).toBeGreaterThan(0);
    });
  });

  describe('カードプレイ', () => {
    it('カードを正しくプレイできる', () => {
      const player = game.getState().players.find(p => p.id === 'id1')!;
      const card = player.hand[0];
      const target = 'id2';

      game.playCard('id1', 0, target);
      const newState = game.getState();
      
      expect(newState.players.find(p => p.id === 'id1')!.hand).toHaveLength(4);
      expect(newState.players.find(p => p.id === 'id1')!.mp).toBeLessThan(50);
    });

    it('MPが不足している場合はカードをプレイできない', () => {
      const player = game.getState().players.find(p => p.id === 'id1')!;
      player.mp = 0;
      
      expect(() => {
        game.playCard('id1', 0, 'id2');
      }).toThrow();
    });
  });

  describe('天候と状態異常', () => {
    it('天候が正しく更新される', () => {
      const initialWeather = game.getState().weather;
      for (let i = 0; i < 5; i++) {
        game.endTurn('id1');
        game.endTurn('id2');
      }
      const newWeather = game.getState().weather;
      expect(newWeather).not.toEqual(initialWeather);
    });

    it('状態異常が正しく適用される', () => {
      const player = game.getState().players.find(p => p.id === 'id1')!;
      game.applyStatusEffect('id1', StatusEffectType.BURN);
      
      const newState = game.getState();
      const updatedPlayer = newState.players.find(p => p.id === 'id1')!;
      expect(updatedPlayer.statusEffects).toContainEqual(expect.objectContaining({
        type: StatusEffectType.BURN
      }));
    });
  });

  describe('勝利条件', () => {
    it('HPが0になったプレイヤーが負ける', () => {
      const player = game.getState().players.find(p => p.id === 'id1')!;
      player.hp = 0;
      
      const gameOver = game.checkGameOver();
      expect(gameOver).toBe(true);
      expect(game.getWinner()).toBe('id2');
    });
  });
}); 