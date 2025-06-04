import { z } from 'zod';
import dotenv from 'dotenv';

// 環境変数のスキーマ定義
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('localhost'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('claude_kingdom'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('claude_kingdom_pass'),
  JWT_SECRET: z.string().default('claude_kingdom_secret_key_2024'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

// 環境変数の型定義
export type Env = z.infer<typeof envSchema>;

// 環境変数のバリデーションと取得
export function validateEnv(): Env {
  dotenv.config();

  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('環境変数のバリデーションエラー:');
      error.errors.forEach(err => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('環境変数の読み込みに失敗しました:', error);
    }
    process.exit(1);
  }
} 