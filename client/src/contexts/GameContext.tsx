import React, { createContext, useContext, useEffect } from 'react';
import { socket } from '../socket.js';
import { IGameState, ICardData, IPlayer } from '../../../shared/types/game.js';
import { useErrorHandler } from '../hooks/useErrorHandler.js';
import { ErrorCodeManager } from '../utils/errorCodeManager.js';

interface GameContextType {
  gameState: IGameState | null;
  gameHistory: GameAction[];
  isLoading: boolean;
  errors: ErrorState[];
  isRecovering: boolean;
  playCard: (cardIndex: number, targetId?: string) => void;
  endTurn: () => void;
  clearErrors: () => void;
  removeError: (timestamp: number) => void;
}

interface GameAction {
  type: 'PLAY_CARD' | 'END_TURN' | 'WEATHER_CHANGE' | 'STATUS_EFFECT';
  timestamp: number;
  details: any;
}

interface ErrorState {
  errorKey: string;
  context?: {
    component?: string;
    action?: string;
    data?: any;
  };
  timestamp: number;
}

interface GameContextProviderProps {
  children: React.ReactNode;
  gameId: string;
  playerId: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const errorCodeManager = ErrorCodeManager.getInstance();

export const GameContextProvider = ({
  children,
  gameId,
  playerId
}: GameContextProviderProps): React.ReactElement => {
  const [gameState, setGameState] = React.useState<IGameState | null>(null);
  const [gameHistory, setGameHistory] = React.useState<GameAction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { 
    errors,
    isRecovering,
    addError,
    clearErrors,
    removeError
  } = useErrorHandler('GameContext');

  useEffect(() => {
    socket.on('gameState', (state: IGameState) => {
      setGameState(state);
      setIsLoading(false);
    });

    socket.on('gameError', (message: string) => {
      addError('GAME_STATE_INVALID', {
        component: 'GameContext',
        action: 'RECEIVE_STATE',
        data: { message }
      });
      setIsLoading(false);
    });

    socket.on('gameWarning', (message: string) => {
      addError('GAME_NOT_INITIALIZED', {
        component: 'GameContext',
        action: 'INITIALIZE',
        data: { message }
      });
    });

    socket.on('gameInfo', (message: string) => {
      addError('RECOVERY_IN_PROGRESS', {
        component: 'GameContext',
        action: 'INFO',
        data: { message }
      });
    });

    socket.on('disconnect', () => {
      addError('CONNECTION_LOST', {
        component: 'GameContext',
        action: 'DISCONNECT'
      });
    });

    socket.on('connect_error', () => {
      addError('CONNECTION_FAILED', {
        component: 'GameContext',
        action: 'CONNECT'
      });
    });

    socket.on('gameEvent', (event: any) => {
      try {
        setGameHistory(prev => [...prev, {
          type: event.type,
          timestamp: Date.now(),
          details: event.data
        }]);
      } catch (error) {
        addError('SYSTEM_ERROR', {
          component: 'GameContext',
          action: 'PROCESS_EVENT',
          data: { error }
        });
      }
    });

    return () => {
      socket.off('gameState');
      socket.off('gameError');
      socket.off('gameWarning');
      socket.off('gameInfo');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('gameEvent');
    };
  }, [addError]);

  const playCard = async (cardIndex: number, targetId?: string) => {
    try {
      if (!gameState) {
        addError('GAME_NOT_INITIALIZED', {
          action: 'PLAY_CARD',
          data: { cardIndex, targetId }
        });
        return;
      }

      const card = gameState.players.find((p: IPlayer) => p.id === playerId)?.hand[cardIndex];
      const targetPlayer = targetId ? gameState.players.find((p: IPlayer) => p.id === targetId) : undefined;

      if (!card) {
        addError('CARD_NOT_FOUND', {
          action: 'PLAY_CARD',
          data: { cardIndex }
        });
        return;
      }

      if (card.type === 'ATTACK' && !targetPlayer) {
        addError('PLAYER_NOT_FOUND', {
          action: 'PLAY_CARD',
          data: { cardIndex, targetId }
        });
        return;
      }

      socket.emit('playCard', {
        gameId,
        cardIndex,
        targetId
      });

      setGameHistory(prev => [...prev, {
        type: 'PLAY_CARD',
        timestamp: Date.now(),
        details: {
          playerId,
          playerName: gameState.players.find((p: IPlayer) => p.id === playerId)?.name,
          cardName: card.name,
          targetId,
          targetName: targetPlayer?.name
        }
      }]);
    } catch (error) {
      addError('INVALID_CARD_PLAY', {
        action: 'PLAY_CARD',
        data: { cardIndex, targetId, error }
      });
    }
  };

  const endTurn = async () => {
    try {
      if (!gameState) {
        addError('GAME_NOT_INITIALIZED', {
          action: 'END_TURN'
        });
        return;
      }

      socket.emit('endTurn', { gameId });

      setGameHistory(prev => [...prev, {
        type: 'END_TURN',
        timestamp: Date.now(),
        details: {
          playerId,
          playerName: gameState.players.find((p: IPlayer) => p.id === playerId)?.name
        }
      }]);
    } catch (error) {
      addError('INVALID_TURN', {
        action: 'END_TURN',
        data: { error }
      });
    }
  };

  const value = {
    gameState,
    gameHistory,
    isLoading,
    errors,
    isRecovering,
    playCard,
    endTurn,
    clearErrors,
    removeError
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameContextProvider');
  }
  return context;
}; 