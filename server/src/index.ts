// エラーハンドリングの設定
process.on('uncaughtException', (error) => {
  console.error('キャッチされていない例外:', error);
  console.error('エラースタック:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('処理されていないPromise拒否:', promise, '理由:', reason);
  process.exit(1);
});

import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Game } from './game.js';
import { validateEnv } from './config/env.js';
import { IPlayer } from '../../shared/types/game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// メインコードをtry-catchで囲む
try {
  // 環境変数のバリデーション
  validateEnv();

  interface JoinGameData {
    gameId: string;
    playerName: string;
  }

  interface PlayCardData {
    gameId: string;
    cardIndex: number;
    targetId: string;
  }

  interface EndTurnData {
    gameId: string;
  }

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // CORSの設定を更新
  app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    credentials: true
  }));

  app.use(express.json());

  // 静的ファイルの提供
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // APIルート
  app.get('/api/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // ポート番号を3001に固定
  const PORT = 3001;
  const games = new Map<string, Game>();

  io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    socket.on('joinGame', (data: JoinGameData) => {
      try {
        const { gameId, playerName } = data;
        let game = games.get(gameId);

        if (!game) {
          game = new Game(io);
          games.set(gameId, game);
        }

        game.addPlayer(socket, playerName);
      } catch (error) {
        console.error('Error in joinGame:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    socket.on('playCard', (data: PlayCardData) => {
      try {
        const { gameId, cardIndex, targetId } = data;
        const game = games.get(gameId);
        if (game) {
          game.handleCardPlay(socket.id, cardIndex, targetId);
        }
      } catch (error) {
        console.error('Error in playCard:', error);
        socket.emit('error', { message: 'Failed to play card' });
      }
    });

    socket.on('endTurn', (data: EndTurnData) => {
      try {
        const { gameId } = data;
        const game = games.get(gameId);
        if (game) {
          game.endTurn(socket.id);
        }
      } catch (error) {
        console.error('Error in endTurn:', error);
        socket.emit('error', { message: 'Failed to end turn' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      try {
        games.forEach((game, gameId) => {
          game.removePlayer(socket.id);
          if (game.getState().players.length === 0) {
            games.delete(gameId);
          }
        });
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('サーバー起動エラー:', error);
  console.error('エラースタック:', error.stack);
  process.exit(1);
} 