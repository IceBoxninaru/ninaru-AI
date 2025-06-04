import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../../../client/src/components/GameBoard';
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
} from '../../../shared/types/game';

const mockCard: ICardData = {
  id: 'card1',
  name: 'テストカード',
  description: 'テスト用のカード',
  element: ElementKind.FIRE,
  type: CardType.ATTACK,
  rarity: CardRarity.COMMON,
  mpCost: 10,
  power: 20
};

const mockPlayer1: IPlayer = {
  id: 'player1',
  name: 'プレイヤー1',
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  faith: 0,
  combo: 0,
  maxCombo: 3,
  gold: 0,
  hand: [mockCard],
  deck: [],
  discardPile: [],
  status: new Map(),
  damageMultiplier: 1,
  mpCostMultiplier: 1,
  damageReceivedMultiplier: 1,
  statusEffects: [],
  drawCard: jest.fn(),
  addStatus: jest.fn(),
  removeStatus: jest.fn(),
  updateStatuses: jest.fn(),
  takeDamage: jest.fn(),
  heal: jest.fn(),
  spendMp: jest.fn(),
  gainMp: jest.fn(),
  spendFaith: jest.fn(),
  addFaith: jest.fn(),
  addCombo: jest.fn(),
  resetCombo: jest.fn()
};

const mockPlayer2: IPlayer = {
  id: 'player2',
  name: 'プレイヤー2',
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  faith: 0,
  combo: 0,
  maxCombo: 3,
  gold: 0,
  hand: [],
  deck: [],
  discardPile: [],
  status: new Map(),
  damageMultiplier: 1,
  mpCostMultiplier: 1,
  damageReceivedMultiplier: 1,
  statusEffects: [],
  drawCard: jest.fn(),
  addStatus: jest.fn(),
  removeStatus: jest.fn(),
  updateStatuses: jest.fn(),
  takeDamage: jest.fn(),
  heal: jest.fn(),
  spendMp: jest.fn(),
  gainMp: jest.fn(),
  spendFaith: jest.fn(),
  addFaith: jest.fn(),
  addCombo: jest.fn(),
  resetCombo: jest.fn()
};

const mockWeather: IWeather = {
  type: WeatherKind.SUNNY,
  duration: 3,
  turnsLeft: 3
};

const mockGameState: IGameState = {
  id: 'game1',
  currentTurn: 1,
  currentPlayerId: 'player1',
  players: [mockPlayer1, mockPlayer2],
  weather: mockWeather,
  phase: GamePhase.MAIN,
  turn: 1
};

describe('GameBoard', () => {
  const mockOnPlayCard = jest.fn();
  const mockOnEndTurn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ゲームボードが正しくレンダリングされる', () => {
    render(
      <GameBoard
        gameState={mockGameState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    expect(screen.getByText('プレイヤー1')).toBeInTheDocument();
    expect(screen.getByText('プレイヤー2')).toBeInTheDocument();
    expect(screen.getByText('テストカード')).toBeInTheDocument();
    expect(screen.getByText(`天候: ${WeatherKind.SUNNY}`)).toBeInTheDocument();
    expect(screen.getByText(/ターン: 1/)).toBeInTheDocument();
  });

  it('カードをプレイできる', () => {
    render(
      <GameBoard
        gameState={mockGameState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    const card = screen.getByText('テストカード');
    fireEvent.click(card);

    expect(mockOnPlayCard).toHaveBeenCalledWith(0, 'player2');
  });

  it('自分のターンでない場合はカードをプレイできない', () => {
    const notYourTurnState: IGameState = {
      ...mockGameState,
      currentPlayerId: 'player2'
    };

    render(
      <GameBoard
        gameState={notYourTurnState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    const card = screen.getByText('テストカード');
    fireEvent.click(card);

    expect(mockOnPlayCard).not.toHaveBeenCalled();
  });

  it('MPが不足している場合はカードをプレイできない', () => {
    const lowMpState: IGameState = {
      ...mockGameState,
      players: [
        { ...mockPlayer1, mp: 5 },
        mockPlayer2
      ]
    };

    render(
      <GameBoard
        gameState={lowMpState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    const card = screen.getByText('テストカード');
    fireEvent.click(card);

    expect(mockOnPlayCard).not.toHaveBeenCalled();
  });

  it('状態異常が正しく表示される', () => {
    const mockStatusEffect: IStatusEffect = {
      type: StatusEffectType.BURN,
      name: '火傷',
      duration: 3,
      description: 'ターン開始時にHPが減少します',
      value: 5,
      turnsLeft: 2
    };

    const stateWithEffects: IGameState = {
      ...mockGameState,
      players: [
        {
          ...mockPlayer1,
          statusEffects: [mockStatusEffect]
        },
        mockPlayer2
      ]
    };

    render(
      <GameBoard
        gameState={stateWithEffects}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    expect(screen.getByText('火傷(2)')).toBeInTheDocument();
  });

  it('ターン終了ボタンが正しく機能する', () => {
    render(
      <GameBoard
        gameState={mockGameState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    const endTurnButton = screen.getByText('ターン終了');
    fireEvent.click(endTurnButton);

    expect(mockOnEndTurn).toHaveBeenCalled();
  });

  it('自分のターンでない場合はターン終了ボタンが無効化される', () => {
    const notYourTurnState: IGameState = {
      ...mockGameState,
      currentPlayerId: 'player2'
    };

    render(
      <GameBoard
        gameState={notYourTurnState}
        currentPlayerId="player1"
        onPlayCard={mockOnPlayCard}
        onEndTurn={mockOnEndTurn}
      />
    );

    const endTurnButton = screen.getByText('ターン終了');
    expect(endTurnButton).toBeDisabled();
  });
}); 