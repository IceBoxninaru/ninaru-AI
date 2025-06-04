import { Socket } from 'socket.io';
import { BaseError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { ErrorResponse } from '../types/game.js';
import { ValidationError } from '../utils/errors.js';

export function handleSocketError(socket: Socket, error: Error | BaseError | ValidationError): void {
  logger.error('Socket error occurred', error);

  let response: ErrorResponse;

  if (error instanceof BaseError || error instanceof ValidationError) {
    response = {
      code: error.code,
      message: error.message,
      details: (error as any).details
    };
  } else {
    response = {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      details: {}
    };
  }

  socket.emit('error', response);
}

export function wrapHandler<T extends any[]>(
  handler: (socket: Socket, ...args: T) => Promise<void> | void
) {
  return async (socket: Socket, ...args: T) => {
    try {
      await handler(socket, ...args);
    } catch (error) {
      handleSocketError(socket, error as Error);
    }
  };
}