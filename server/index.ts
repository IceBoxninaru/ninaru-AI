import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState, Player, Card, WeatherKind, ElementKind, StatusEffectType } from '../shared/types/game.js';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomCard } from './data/cards.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { GameManager } from './game/GameManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const games = new Map<string, GameState>();
const players = new Map<string, Player>();

const createInitialHand = (): Card[] => {
  const hand: Card[] = [];
  for (let i = 0; i < 5; i++) {
    hand.push(generateRandomCard());
  }
  return hand;
};

const createPlayer = (name: string): Player => {
  return {
    id: uuidv4(),
    name,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    gold: 0,
    faith: 0,
    combo: 0,
    maxCombo: 0,
    hand: createInitialHand(),
    deck: [],
    discardPile: [],
    status: new Map<StatusEffectType, number>(),
    mpCostMultiplier: 1,
    damageMultiplier: 1,
    damageReceivedMultiplier: 1
  };
};

const createGame = (player1: Player): GameState => {
  return {
    id: uuidv4(),
    players: [player1],
    currentPlayer: 0,
    turn: 1,
    phase: 'DRAW',
    weather: 'SUNNY',
    winner: undefined
  };
};

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../client/build')));

const gameManager = new GameManager(io);

// ルートパスのハンドラー
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// APIエンドポイント
app.get('/api/game-state/:gameId', (req, res) => {
  const game = games.get(req.params.gameId);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  res.json(game);
});

// Socket.IOイベントハンドラ
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('createGame', (players: string[]) => {
    const gameId = gameManager.createGame(players);
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId: string) => {
    socket.join(gameId);
  });

  socket.on('playCard', (data: { gameId: string; playerId: string; cardIndex: number; targetId?: string }) => {
    const { gameId, playerId, cardIndex, targetId } = data;
    gameManager.playCard(gameId, playerId, cardIndex, targetId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});