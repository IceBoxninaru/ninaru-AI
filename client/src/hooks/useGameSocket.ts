import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, Card, DamageEvent, ErrorResponse } from '../types/game.js';

interface UseGameSocketOptions {
  serverUrl: string;
  roomId: string;
  onError?: (error: ErrorResponse) => void;
}

interface UseGameSocketReturn {
  socket: Socket | null;
  gameState: GameState | null;
  hand: Card[];
  myId: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: ErrorResponse | null;
  playCard: (cardIndex: number, targetId?: string, betAmount?: number) => void;
  reconnect: () => void;
}

export function useGameSocket({ serverUrl, roomId, onError }: UseGameSocketOptions): UseGameSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [myId, setMyId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (socket?.connected) return;

    setIsConnecting(true);
    setError(null);

    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setIsConnecting(false);
      setMyId(newSocket.id || '');
      reconnectAttemptsRef.current = 0;
      newSocket.emit('join', { roomId });
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setIsConnecting(false);
      setError({
        code: 'CONNECTION_ERROR',
        message: 'サーバーへの接続に失敗しました'
      });
      
      if (reconnectAttemptsRef.current < 5) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000));
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        setError({
          code: 'SERVER_DISCONNECT',
          message: 'サーバーから切断されました'
        });
      } else if (reason === 'transport error') {
        setError({
          code: 'TRANSPORT_ERROR',
          message: 'ネットワークエラーが発生しました'
        });
      }
    });

    newSocket.on('joinSuccess', ({ playerId }) => {
      setMyId(playerId);
    });

    newSocket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('hand', (cards: Card[]) => {
      setHand(cards);
    });

    newSocket.on('damage', (event: DamageEvent) => {
      console.log('Damage event:', event);
    });

    newSocket.on('error', (errorResponse: ErrorResponse) => {
      console.error('Game error:', errorResponse);
      setError(errorResponse);
      onError?.(errorResponse);
    });

    setSocket(newSocket);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newSocket.close();
    };
  }, [serverUrl, roomId, onError, socket?.connected]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
    };
  }, []);

  const playCard = useCallback((cardIndex: number, targetId?: string, betAmount?: number) => {
    if (!socket || !isConnected) {
      setError({
        code: 'NOT_CONNECTED',
        message: 'サーバーに接続されていません'
      });
      return;
    }

    socket.emit('playCard', {
      roomId,
      cardIndex,
      targetId,
      betAmount
    });
  }, [socket, isConnected, roomId]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    connect();
  }, [socket, connect]);

  return {
    socket,
    gameState,
    hand,
    myId,
    isConnected,
    isConnecting,
    error,
    playCard,
    reconnect
  };
}