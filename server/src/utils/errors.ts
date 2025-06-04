export class GameError extends Error {
  constructor(
    message: string,
    public code: string = 'GAME_ERROR',
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export class ValidationError extends GameError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends GameError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends GameError {
  constructor(message: string) {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends GameError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
    this.name = 'InternalServerError';
  }
}

export const errorHandler = (err: Error) => {
  if (err instanceof GameError) {
    return {
      status: err.statusCode,
      body: {
        error: {
          code: err.code,
          message: err.message
        }
      }
    };
  }

  // 未知のエラーの場合
  const internalError = new InternalServerError();
  return {
    status: internalError.statusCode,
    body: {
      error: {
        code: internalError.code,
        message: internalError.message
      }
    }
  };
}; 