import { z } from 'zod';
import { config } from 'dotenv';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  config();

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