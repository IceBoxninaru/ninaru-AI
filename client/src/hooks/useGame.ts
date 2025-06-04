import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { IGameState, IPlayerData, ICardData } from '../../../shared/types/game';

const SOCKET_URL = 'http://localhost:3001';

export const useGame = (playerId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<IGameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('error', (error: { message: string }) => {
      setError(error.message);
    });

    newSocket.on('gameCreated', (newGameId: string) => {
      setGameId(newGameId);
      setError(null);
    });

    newSocket.on('gameStateUpdate', (newGameState: IGameState) => {
      setGameState(newGameState);
      setError(null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = useCallback(() => {
    if (socket) {
      socket.emit('createGame', [playerId]);
    }
  }, [socket, playerId]);

  const joinGame = useCallback((gameIdToJoin: string) => {
    if (socket) {
      socket.emit('joinGame', gameIdToJoin);
      setGameId(gameIdToJoin);
    }
  }, [socket]);

  const playCard = useCallback((cardIndex: number, targetId?: string) => {
    if (socket && gameId) {
      socket.emit('playCard', {
        gameId,
        playerId,
        cardIndex,
        targetId
      });
    }
  }, [socket, gameId, playerId]);

  const getCurrentPlayer = useCallback(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id === playerId) || null;
  }, [gameState, playerId]);

  const getOpponents = useCallback(() => {
    if (!gameState) return [];
    return gameState.players.filter(p => p.id !== playerId);
  }, [gameState, playerId]);

  const isPlayerTurn = useCallback(() => {
    if (!gameState) return false;
    return gameState.players[gameState.currentPlayer].id === playerId;
  }, [gameState, playerId]);

  return {
    gameId,
    gameState,
    error,
    createGame,
    joinGame,
    playCard,
    getCurrentPlayer,
    getOpponents,
    isPlayerTurn
  };
}; 