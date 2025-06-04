import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameBoard } from '../../../client/src/components/GameBoard';
import { IGameState, IPlayer, ICardData, IWeather, IStatusEffect, StatusEffectType } from '../../../shared/types/game';

const mockCard: ICardData = {
  id: 'card1',
  name: 'テストカード',
  description: 'テスト用のカード',
  element: 'FIRE',
  type: 'ATTACK',
  rarity: 'COMMON',
  mpCost: 10,
  power: 20
};

const mockPlayer1: IPlayer = {
  id: 'player1',
  name: 'プレイヤー1',
  hp: 100,
  mp: 50,
  faith: 0,
  hand: [mockCard],
  deck: [],
  statusEffects: []
};

const mockPlayer2: IPlayer = {
  id: 'player2',
  name: 'プレイヤー2',
  hp: 100,
  mp: 50,
  faith: 0,
  hand: [],
  deck: [],
  statusEffects: []
};

const mockWeather: IWeather = {
  type: 'SUNNY',
  turnsLeft: 3
};

const mockGameState: IGameState = {
  currentTurn: 1,
  currentPlayerId: 'player1',
  players: [mockPlayer1, mockPlayer2],
  weather: mockWeather
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
    expect(screen.getByText(/天候: SUNNY/)).toBeInTheDocument();
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
      type: 'BURN' as StatusEffectType,
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

    expect(screen.getByText('BURN(2)')).toBeInTheDocument();
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