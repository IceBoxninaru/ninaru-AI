import { z } from 'zod';
import { Card, Player, GameState, ElementType, CardType, GamePhase, WeatherType, StatusEffect, GAME_PHASES, WEATHER_TYPES } from '../../shared/types/game.js';

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number().min(0).max(2000),
  maxHp: z.number().min(0).max(2000),
  mp: z.number().min(0).max(300),
  maxMp: z.number().min(0).max(300),
  gold: z.number().min(0),
  faith: z.number().min(0).max(5),
  team: z.number().optional(),
  hand: z.array(z.any()),
  deck: z.array(z.any()),
  discardPile: z.array(z.any()),
  status: z.map(z.string(), z.number()),
  mpCostMultiplier: z.number(),
  damageMultiplier: z.number(),
  damageReceivedMultiplier: z.number(),
  combo: z.number(),
  maxCombo: z.number(),
  lastPlayedElement: z.string().optional()
});

export const GameStateSchema = z.object({
  players: z.array(PlayerSchema),
  currentPlayer: z.number(),
  turn: z.number().min(1),
  phase: z.enum(GAME_PHASES as [string, ...string[]]),
  weather: z.enum(WEATHER_TYPES as [string, ...string[]]),
  field: z.enum(['curse', 'holy', 'thunder', 'fire', 'ice', 'poison', 'none']),
  winner: z.string().optional()
});

export type { Card, Player, GameState, ElementType, CardType, GamePhase, WeatherType, StatusEffect };

export interface PlayCardRequest {
  roomId: string;
  cardIndex: number;
  targetId?: string;
  betAmount?: number;
}

export interface GameStateUpdate {
  players: Player[];
  turn: number;
  phase: GamePhase;
  weather: WeatherType;
  pot: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}