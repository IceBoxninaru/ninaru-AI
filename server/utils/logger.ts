import env from '../config/environment.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private currentLevel: number;

  constructor() {
    this.currentLevel = this.levels[env.LOG_LEVEL] || 1;
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (this.levels[level] >= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const output = {
        timestamp,
        level,
        message,
        ...(meta && { meta })
      };

      if (level === 'error') {
        console.error(JSON.stringify(output));
      } else if (level === 'warn') {
        console.warn(JSON.stringify(output));
      } else {
        console.log(JSON.stringify(output));
      }
    }
  }

  debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | any): void {
    this.log('error', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
  }
}

export const logger = new Logger();