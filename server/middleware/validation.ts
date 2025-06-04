import { z } from 'zod';
import { Socket } from 'socket.io';
import { ValidationError } from '../utils/errors.js';

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'VALIDATION_FAILED',
        'Request validation failed',
        error.errors
      );
    }
    throw error;
  }
}

export const playCardSchema = z.object({
  roomId: z.string().min(1),
  cardIndex: z.number().int().min(0),
  targetId: z.string().optional(),
  betAmount: z.number().int().min(1).max(99).optional()
});

export const joinRoomSchema = z.object({
  roomId: z.string().min(1).max(50)
});

export const tradeSchema = z.object({
  roomId: z.string().min(1),
  targetPlayerId: z.string().min(1),
  cardIndex: z.number().int().min(0),
  price: z.number().int().min(1).max(999)
});