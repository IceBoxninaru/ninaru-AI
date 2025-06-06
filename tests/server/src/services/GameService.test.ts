import { GameService } from '../../../../server/src/services/GameService.js';
import { GamePhase, WeatherKind, CardType, ElementKind, CardRarity, StatusEffectType } from '../../../../shared/types/game.js';

describe('GameService', () => {
  let gameService: GameService;
  let gameId: string;

  beforeEach(() => {
    gameService = new GameService();
    gameId = gameService.createGame();
  });

  describe('Game initialization', () => {
    it('should create a new game with valid ID', () => {
      expect(gameId).toBeDefined();
      expect(typeof gameId).toBe('string');
      expect(gameId.length).toBeGreaterThan(0);
    });

    it('should initialize game with correct state', () => {
      const gameState = gameService.getGameById(gameId);
      expect(gameState).toEqual({
        id: gameId,
        currentTurn: 1,
        currentPlayerId: '',
        players: [],
        weather: { type: WeatherKind.CLEAR, duration: 3 },
        phase: GamePhase.WAIT
      });
    });
  });

  describe('Player management', () => {
    it('should allow a player to join the game', () => {
      const playerId = 'player1';
      const playerName = 'Player 1';
      
      gameService.joinGame(gameId, playerId, playerName);
      const gameState = gameService.getGameById(gameId);
      
      expect(gameState.players).toHaveLength(1);
      expect(gameState.players[0]).toMatchObject({
        id: playerId,
        name: playerName,
        hp: 2000,
        maxHp: 2000,
        mp: 100,
        maxMp: 100,
        gold: 1000
      });
    });

    it('should not allow more than 2 players', () => {
      gameService.joinGame(gameId, 'player1', 'Player 1');
      gameService.joinGame(gameId, 'player2', 'Player 2');
      
      expect(() => {
        gameService.joinGame(gameId, 'player3', 'Player 3');
      }).toThrow('Game is full');
    });

    it('should start game when second player joins', () => {
      gameService.joinGame(gameId, 'player1', 'Player 1');
      gameService.joinGame(gameId, 'player2', 'Player 2');
      
      const gameState = gameService.getGameById(gameId);
      expect(gameState.phase).toBe(GamePhase.DRAW);
      expect(gameState.currentPlayerId).toBe('player1');
    });
  });

  describe('Card playing', () => {
    let player1Id: string;
    let player2Id: string;

    beforeEach(() => {
      player1Id = 'player1';
      player2Id = 'player2';
      gameService.joinGame(gameId, player1Id, 'Player 1');
      gameService.joinGame(gameId, player2Id, 'Player 2');
    });

    it('should allow playing an attack card', () => {
      const game = gameService.getGameById(gameId);
      const player = game.players[0];
      const opponent = game.players[1];
      const initialHp = opponent.hp;

      // プレイヤーの手札に攻撃カードを追加
      player.hand.push({
        id: 'test_attack',
        name: 'テスト攻撃',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.FIRE,
        mpCost: 0,
        description: 'テスト用の攻撃カード',
        rarity: CardRarity.COMMON
      });

      // カードをプレイ
      gameService.playCard(gameId, player.id, opponent.id, '0');

      // 結果を確認
      const updatedGame = gameService.getGameById(gameId);
      const updatedOpponent = updatedGame.players[1];
      expect(updatedOpponent.hp).toBeLessThan(initialHp);
    });

    it('should not allow playing a card without enough MP', () => {
      const game = gameService.getGameById(gameId);
      const player = game.players[0];
      player.mp = 10;

      // プレイヤーの手札に高コストのカードを追加
      player.hand.push({
        id: 'test_magic',
        name: 'テスト魔法',
        type: CardType.MAGIC,
        power: 200,
        element: ElementKind.WIND,
        mpCost: 50,
        description: 'テスト用の魔法カード',
        rarity: CardRarity.COMMON
      });

      // カードをプレイしようとする
      expect(() => {
        gameService.playCard(gameId, player.id, player2Id, '0');
      }).toThrow('Not enough MP');
    });

    it('should not allow playing a card when stunned', () => {
      const game = gameService.getGameById(gameId);
      const player = game.players[0];

      // プレイヤーをスタン状態にする
      player.statusEffects.push({ type: StatusEffectType.STUN, duration: 1 });

      // プレイヤーの手札にカードを追加
      player.hand.push({
        id: 'test_card',
        name: 'テストカード',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.NEUTRAL,
        mpCost: 0,
        description: 'テスト用のカード',
        rarity: CardRarity.COMMON
      });

      // カードをプレイしようとする
      expect(() => {
        gameService.playCard(gameId, player.id, player2Id, '0');
      }).toThrow('Player is stunned');
    });
  });

  describe('ターン管理', () => {
    let player1Id: string;
    let player2Id: string;

    beforeEach(() => {
      player1Id = 'player1';
      player2Id = 'player2';
      gameService.joinGame(gameId, player1Id, 'Player 1');
      gameService.joinGame(gameId, player2Id, 'Player 2');
    });

    it('ターンが正しく交代する', () => {
      // 初期状態では最初のプレイヤーがアクティブ
      let gameState = gameService.getGameById(gameId);
      expect(gameState.currentPlayerId).toBe(player1Id);
      expect(gameState.currentTurn).toBe(1);

      // ターンを終了
      gameService.endTurn(gameId);

      // 2番目のプレイヤーに交代
      gameState = gameService.getGameById(gameId);
      expect(gameState.currentPlayerId).toBe(player2Id);
      expect(gameState.currentTurn).toBe(2);

      // もう一度ターンを終了
      gameService.endTurn(gameId);

      // 最初のプレイヤーに戻る
      gameState = gameService.getGameById(gameId);
      expect(gameState.currentPlayerId).toBe(player1Id);
      expect(gameState.currentTurn).toBe(3);
    });

    it('非アクティブプレイヤーはカードをプレイできない', () => {
      const game = gameService.getGameById(gameId);
      const player = game.players[1]; // 非アクティブプレイヤー

      // プレイヤーの手札にカードを追加
      player.hand.push({
        id: 'test_card',
        name: 'テストカード',
        type: CardType.ATTACK,
        power: 100,
        element: ElementKind.NEUTRAL,
        mpCost: 0,
        description: 'テスト用のカード',
        rarity: CardRarity.COMMON
      });

      // 非アクティブプレイヤーがカードをプレイしようとする
      expect(() => {
        gameService.playCard(gameId, player2Id, player1Id, '0');
      }).toThrow('Not your turn');
    });

    it('ターン終了時にステータス効果の持続時間が減少する', () => {
      const game = gameService.getGameById(gameId);
      const player = game.players[0];

      // プレイヤーにステータス効果を付与
      player.statusEffects.push(
        { type: StatusEffectType.POISON, duration: 2 },
        { type: StatusEffectType.BURN, duration: 1 }
      );

      // ターンを終了
      gameService.endTurn(gameId);

      // ステータス効果の持続時間が減少していることを確認
      const updatedGame = gameService.getGameById(gameId);
      const updatedPlayer = updatedGame.players[0];
      
      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.statusEffects[0]).toEqual({
        type: StatusEffectType.POISON,
        duration: 1
      });
    });

    it('ターン終了時に天候の持続時間が減少する', () => {
      const game = gameService.getGameById(gameId);
      const initialDuration = game.weather.duration;

      // ターンを終了
      gameService.endTurn(gameId);

      // 天候の持続時間が減少していることを確認
      const updatedGame = gameService.getGameById(gameId);
      expect(updatedGame.weather.duration).toBe(initialDuration - 1);
    });
  });
}); 