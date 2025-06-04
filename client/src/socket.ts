import { io } from 'socket.io-client';

interface ImportMetaEnv {
  VITE_SOCKET_URL: string;
}

const SOCKET_URL = (import.meta.env as ImportMetaEnv).VITE_SOCKET_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
}); 