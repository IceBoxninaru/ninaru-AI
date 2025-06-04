import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173').transform(s => s.split(',')),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  TICK_RATE: z.string().default('30').transform(Number),
  SESSION_TIMEOUT: z.string().default('300000').transform(Number),
  MAX_PLAYERS: z.string().default('9').transform(Number),
  MIN_PLAYERS: z.string().default('2').transform(Number)
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('Environment validation failed:', error);
  process.exit(1);
}

export default env;