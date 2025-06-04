export class BaseError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  code: string;
  details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.code = code;
    this.name = 'ValidationError';
    if (details) {
      this.details = details;
    }
  }
}

export class GameError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'GameError';
  }
}

export class AuthError extends BaseError {
  constructor(code: string, message: string, details?: any) {
    super(code, message, 401, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(code: string, message: string, details?: any) {
    super(code, message, 404, details);
  }
}