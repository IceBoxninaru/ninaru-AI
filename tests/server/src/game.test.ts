import { jest } from '@jest/globals';
import { Game } from '../../../server/src/game.js';
import { WeatherKind, StatusEffectType, ElementKind, GamePhase } from '../../../shared/types/game.js';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

// socket.ioの簡単なモック
const mockServer = {
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  sockets: {
    emit: jest.fn()
  }
} as unknown as Server;

describe('ゲームロジック（基本テスト）', () => {
  // 短いタイムアウト設定
  jest.setTimeout(5000);

  let game: Game;
  let mockSocket1: Socket;
  let mockSocket2: Socket;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers(); // タイマーをモック
    
    // 簡単なモックソケット
    mockSocket1 = {
      id: 'player1',
      emit: jest.fn(),
      on: jest.fn(),
      join: jest.fn(),
      leave: jest.fn()
    } as unknown as Socket;

    mockSocket2 = {
      id: 'player2', 
      emit: jest.fn(),
      on: jest.fn(),
      join: jest.fn(),
      leave: jest.fn()
    } as unknown as Socket;

    game = new Game(mockServer);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('基本初期化', () => {
    it('ゲームが正しく作成される', () => {
      expect(game).toBeDefined();
      const state = game.getState();
      expect(state.players).toHaveLength(0);
      expect(state.phase).toBe(GamePhase.WAIT);
    });

    it('プレイヤーを追加できる', () => {
      const success1 = game.addPlayer(mockSocket1, 'Player 1');
      expect(success1).toBe(true);
      
      const state = game.getState();
      expect(state.players).toHaveLength(1);
      expect(state.players[0].id).toBe('player1');
      expect(state.players[0].name).toBe('Player 1');
    });

    it('2人のプレイヤーを追加できる', () => {
      game.addPlayer(mockSocket1, 'Player 1');
      game.addPlayer(mockSocket2, 'Player 2');
      
      const state = game.getState();
      expect(state.players).toHaveLength(2);
      expect(state.players[0].id).toBe('player1');
      expect(state.players[1].id).toBe('player2');
    });
  });

  describe('プレイヤー情報', () => {
    beforeEach(() => {
      game.addPlayer(mockSocket1, 'Player 1');
      game.addPlayer(mockSocket2, 'Player 2');
    });

    it('プレイヤーを取得できる', () => {
      const player1 = game.getPlayer('player1');
      const player2 = game.getPlayer('player2');
      
      expect(player1).not.toBeNull();
      expect(player2).not.toBeNull();
      expect(player1?.id).toBe('player1');
      expect(player2?.id).toBe('player2');
    });

    it('存在しないプレイヤーはnullを返す', () => {
      const nonExistentPlayer = game.getPlayer('nonexistent');
      expect(nonExistentPlayer).toBeNull();
    });

    it('全プレイヤーを取得できる', () => {
      const players = game.getPlayers();
      expect(players).toHaveLength(2);
      expect(players[0].id).toBe('player1');
      expect(players[1].id).toBe('player2');
    });
  });

  describe('ゲーム開始', () => {
    it('2人以上いればゲームを開始できる', () => {
      game.addPlayer(mockSocket1, 'Player 1');
      game.addPlayer(mockSocket2, 'Player 2');
      
      expect(() => {
        game.start();
      }).not.toThrow();
      
      const state = game.getState();
      expect(state.phase).toBe(GamePhase.MAIN);
      expect(state.currentPlayerId).toBe('player1');
    });

    it('1人だけではゲームを開始できない', () => {
      game.addPlayer(mockSocket1, 'Player 1');
      
      expect(() => {
        game.start();
      }).toThrow('ゲームを開始するには2人以上のプレイヤーが必要です');
    });
  });

  describe('現在のプレイヤー', () => {
    beforeEach(() => {
      game.addPlayer(mockSocket1, 'Player 1');
      game.addPlayer(mockSocket2, 'Player 2');
      game.start();
    });

    it('現在のプレイヤーを取得できる', () => {
      const currentPlayer = game.getCurrentPlayer();
      expect(currentPlayer).not.toBeNull();
      expect(currentPlayer?.id).toBe('player1');
    });

    it('プレイヤーの初期状態が正しい', () => {
      const player1 = game.getPlayer('player1');
      expect(player1).not.toBeNull();
      if (!player1) return;

      expect(player1.hp).toBe(2000);
      expect(player1.maxHp).toBe(2000);
      expect(player1.mp).toBe(150);
      expect(player1.hand).toHaveLength(5);
      expect(player1.deck).toHaveLength(25);
      expect(player1.statusEffects).toEqual([]);
    });
  });
}); 