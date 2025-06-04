import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { Game } from './game';
import { validateEnv } from './config/env';
import { IPlayer } from '../../shared/types/game';

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
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../../client/dist')));

// APIルート
app.get('/api/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
const games = new Map<string, Game>();

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('joinGame', (data: JoinGameData) => {
    const { gameId, playerName } = data;
    let game = games.get(gameId);

    if (!game) {
      game = new Game(io);
      games.set(gameId, game);
    }

    game.addPlayer(socket, playerName);
  });

  socket.on('playCard', (data: PlayCardData) => {
    const { gameId, cardIndex, targetId } = data;
    const game = games.get(gameId);
    if (game) {
      game.handleCardPlay(socket.id, cardIndex, targetId);
    }
  });

  socket.on('endTurn', (data: EndTurnData) => {
    const { gameId } = data;
    const game = games.get(gameId);
    if (game) {
      game.endTurn(socket.id);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    games.forEach((game, gameId) => {
      game.removePlayer(socket.id);
      if (game.getState().players.length === 0) {
        games.delete(gameId);
      }
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 