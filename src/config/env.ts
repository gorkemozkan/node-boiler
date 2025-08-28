import { z } from 'zod';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${nodeEnv}`,
  override: true,
});

dotenv.config(); // Fallback to .env

const envSchema = z.object({
  // Core application settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),
  
  // Database configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // JWT configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long').optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  
  // Security settings
  CORS_ORIGIN: z.string().default('*'),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // API settings
  API_PREFIX: z.string().default('/api/v1'),
  
  // Optional: Redis for caching/sessions
  REDIS_URL: z.string().url().optional(),
  
  // Optional: External services
  SENTRY_DSN: z.string().url().optional(),
  
  // Optional: Email service
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().positive()).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Optional: File upload
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default('5242880'), // 5MB
  UPLOAD_PATH: z.string().default('./uploads'),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  const errors = envParse.error.flatten();
  console.error('❌ Environment validation failed:');
  
  Object.entries(errors.fieldErrors).forEach(([field, fieldErrors]) => {
    console.error(`  ${field}: ${fieldErrors?.join(', ')}`);
  });
  
  if (errors.formErrors.length > 0) {
    console.error('  Form errors:', errors.formErrors.join(', '));
  }
  
  throw new Error('Invalid environment variables. Please check the configuration.');
}

export const env = envParse.data;

if (env.NODE_ENV === 'development') {
  if (env.JWT_SECRET === 'your-secret-key' || env.JWT_SECRET.length < 32) {
    console.warn('Warning: Using weak JWT_SECRET in development. Use a strong secret in production.');
  }
  
  if (env.CORS_ORIGIN === '*') {
    console.warn('Warning: CORS_ORIGIN is set to "*" in development. Configure specific origins for production.');
  }
}

export type Env = typeof env;
