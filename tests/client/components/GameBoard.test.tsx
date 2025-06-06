import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../../../client/src/components/GameBoard.js';
import {
  IGameState,
  IPlayer,
  ICardData,
  IWeather,
  IStatusEffect,
  StatusEffectType,
  ElementKind,
  CardType,
  CardRarity,
  WeatherKind,
  GamePhase
} from '../../../shared/types/game.js';

// モックデータの定義
const createMockCard = (overrides = {}): ICardData => ({
  id: 'card1',
  name: 'テストカード',
  type: CardType.ATTACK,
  element: ElementKind.FIRE,
  mpCost: 10,
  description: 'テストカードの説明',
  rarity: CardRarity.COMMON,
  power: 100,
  isPlayable: true,
  ...overrides
});

const createMockPlayer = (id: string, overrides = {}): IPlayer => ({
  id,
  name: `プレイヤー${id}`,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  faith: 0,
  maxFaith: 100,
  combo: 0,
  maxCombo: 3,
  gold: 0,
  hand: [createMockCard()],
  deck: [],
  discardPile: [],
  statusEffects: [],
  status: new Map(),
  damageMultiplier: 1,
  mpCostMultiplier: 1,
  damageReceivedMultiplier: 1,
  
  drawCard: jest.fn(),
  playCard: jest.fn(),
  canPlayCard: jest.fn(),
  takeDamage: jest.fn(),
  heal: jest.fn(),
  gainMp: jest.fn(),
  spendMp: jest.fn(),
  addFaith: jest.fn(),
  spendFaith: jest.fn(),
  addCombo: jest.fn(),
  resetCombo: jest.fn(),
  isCriticalHit: jest.fn(),
  addStatus: jest.fn(),
  removeStatus: jest.fn(),
  hasStatusEffect: jest.fn(),
  updateStatuses: jest.fn(),
  isAlive: jest.fn(() => true),
  resetForNewGame: jest.fn(),
  ...overrides
});

const createMockGameState = (overrides = {}): IGameState => ({
  id: 'game1',
  players: [createMockPlayer('player1'), createMockPlayer('player2')],
  currentPlayerId: 'player1',
  currentTurn: 1,
  weather: { type: WeatherKind.SUNNY, duration: 3 },
  phase: GamePhase.MAIN,
  maxPlayers: 2,
  gameMode: 'STANDARD',
  ...overrides
});

describe('GameBoard', () => {
  const mockOnPlayCard = jest.fn();
  const mockOnEndTurn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本レンダリング', () => {
    it('ゲームボードの基本要素が正しくレンダリングされる', () => {
      const gameState = createMockGameState();
      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      // プレイヤー情報の確認
      expect(screen.getByText('プレイヤーplayer1')).toBeInTheDocument();
      expect(screen.getByText('プレイヤーplayer2')).toBeInTheDocument();

      // カード情報の確認
      expect(screen.getByText('テストカード')).toBeInTheDocument();

      // 天候情報の確認
      const weatherInfo = screen.getByText(/天候:/).parentElement;
      expect(weatherInfo).toHaveTextContent('SUNNY');
    });

    it('プレイヤーのステータスが正しく表示される', () => {
      const player = createMockPlayer('player1', {
        hp: 80,
        maxHp: 100,
        mp: 30,
        maxMp: 50
      });
      const gameState = createMockGameState({ players: [player, createMockPlayer('player2')] });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      // HP/MPの表示確認
      const stats = screen.getAllByText(/\d+\/\d+/);
      expect(stats[0]).toHaveTextContent('80/100'); // HP
      expect(stats[1]).toHaveTextContent('30/50'); // MP
    });
  });

  describe('カード操作', () => {
    it('カードをプレイできる（十分なMPがある場合）', () => {
      const gameState = createMockGameState();
      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const card = screen.getByText('テストカード');
      fireEvent.click(card);

      expect(mockOnPlayCard).toHaveBeenCalledWith(0, 'player2');
    });

    it('MPが不足している場合はカードをプレイできない', () => {
      const player = createMockPlayer('player1', { mp: 5 });
      const gameState = createMockGameState({ players: [player, createMockPlayer('player2')] });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const card = screen.getByText('テストカード');
      fireEvent.click(card);

      expect(mockOnPlayCard).not.toHaveBeenCalled();
    });
  });

  describe('ステータス効果', () => {
    it('ステータス効果が正しく表示される', () => {
      const statusEffect: IStatusEffect = {
        type: StatusEffectType.BURN,
        duration: 2
      };
      const player = createMockPlayer('player1', {
        statusEffects: [statusEffect]
      });
      const gameState = createMockGameState({ players: [player, createMockPlayer('player2')] });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const statusEffects = screen.getByTestId('status-effects');
      expect(statusEffects).toHaveTextContent('火傷');
      expect(statusEffects).toHaveTextContent('2');
    });

    it('複数のステータス効果が正しく表示される', () => {
      const statusEffects: IStatusEffect[] = [
        { type: StatusEffectType.BURN, duration: 2 },
        { type: StatusEffectType.POISON, duration: 3 }
      ];
      const player = createMockPlayer('player1', { statusEffects });
      const gameState = createMockGameState({ players: [player, createMockPlayer('player2')] });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const statusEffectsElement = screen.getByTestId('status-effects');
      expect(statusEffectsElement).toHaveTextContent('火傷');
      expect(statusEffectsElement).toHaveTextContent('2');
      expect(statusEffectsElement).toHaveTextContent('毒');
      expect(statusEffectsElement).toHaveTextContent('3');
    });
  });

  describe('天候システム', () => {
    it('天候の種類と残りターン数が正しく表示される', () => {
      const weather: IWeather = { type: WeatherKind.RAINY, duration: 4 };
      const gameState = createMockGameState({ weather });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const weatherInfo = screen.getByText(/天候:/).parentElement;
      expect(weatherInfo).toHaveTextContent('RAINY');
      expect(weatherInfo).toHaveTextContent('4');
    });

    it('天候効果によるダメージ修正が表示される', () => {
      const weather: IWeather = { type: WeatherKind.SUNNY, duration: 3 };
      const gameState = createMockGameState({ weather });

      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const weatherEffects = screen.getByTestId('weather-effects');
      expect(weatherEffects).toHaveTextContent('火属性');
      expect(weatherEffects).toHaveTextContent('1.2x');
    });
  });

  describe('ターン管理', () => {
    it('自分のターンの時のみターン終了ボタンが有効', () => {
      const gameState = createMockGameState();
      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const endTurnButton = screen.getByText('ターン終了');
      expect(endTurnButton).not.toBeDisabled();
      fireEvent.click(endTurnButton);
      expect(mockOnEndTurn).toHaveBeenCalled();
    });

    it('相手のターンの時はターン終了ボタンが無効', () => {
      const gameState = createMockGameState({ currentPlayerId: 'player2' });
      render(
        <GameBoard
          gameState={gameState}
          currentPlayerId="player1"
          onPlayCard={mockOnPlayCard}
          onEndTurn={mockOnEndTurn}
        />
      );

      const endTurnButton = screen.getByText('ターン終了');
      expect(endTurnButton).toBeDisabled();
    });
  });
}); 