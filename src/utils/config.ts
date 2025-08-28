import { env } from '../config/env';

export class Config {
  static get isDevelopment(): boolean {
    return env.NODE_ENV === 'development';
  }

  static get isProduction(): boolean {
    return env.NODE_ENV === 'production';
  }

  static get isTest(): boolean {
    return env.NODE_ENV === 'test';
  }

  static get server() {
    return {
      port: env.PORT,
      apiPrefix: env.API_PREFIX,
      nodeEnv: env.NODE_ENV,
    };
  }

  static get database() {
    return {
      url: env.DATABASE_URL,
    };
  }

  static get jwt() {
    return {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshSecret: env.JWT_REFRESH_SECRET,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    };
  }

  static get rateLimit() {
    return {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    };
  }

  static get cors() {
    return {
      origin: env.CORS_ORIGIN,
      credentials: env.CORS_CREDENTIALS,
    };
  }

  static get logging() {
    return {
      level: env.LOG_LEVEL,
    };
  }

  static get redis() {
    return {
      url: env.REDIS_URL,
      isEnabled: !!env.REDIS_URL,
    };
  }

  static get sentry() {
    return {
      dsn: env.SENTRY_DSN,
      isEnabled: !!env.SENTRY_DSN,
    };
  }

  static get smtp() {
    return {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
      isEnabled: !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
    };
  }

  static get upload() {
    return {
      maxFileSize: env.MAX_FILE_SIZE,
      uploadPath: env.UPLOAD_PATH,
    };
  }


  static validateProductionConfig(): void {
    if (this.isProduction) {
      const errors: string[] = [];

      if (env.JWT_SECRET.length < 32) {
        errors.push('JWT_SECRET must be at least 32 characters long in production');
      }


      if (env.CORS_ORIGIN === '*') {
        errors.push('CORS_ORIGIN should be specific domains in production, not "*"');
      }


      if (env.JWT_SECRET === 'your-secret-key' || env.JWT_SECRET.includes('secret')) {
        errors.push('JWT_SECRET should not contain default or weak values in production');
      }

      if (errors.length > 0) {
        throw new Error(`Production configuration errors:\n${errors.join('\n')}`);
      }
    }
  }


  static getSummary(): Record<string, any> {
    return {
      environment: env.NODE_ENV,
      server: {
        port: env.PORT,
        apiPrefix: env.API_PREFIX,
      },
      database: {
        url: env.DATABASE_URL ? 'configured' : 'missing',
      },
      jwt: {
        secret: env.JWT_SECRET ? 'configured' : 'missing',
        expiresIn: env.JWT_EXPIRES_IN,
      },
      rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
      },
      cors: {
        origin: env.CORS_ORIGIN,
        credentials: env.CORS_CREDENTIALS,
      },
      optional: {
        redis: !!env.REDIS_URL,
        sentry: !!env.SENTRY_DSN,
        smtp: !!env.SMTP_HOST,
      },
    };
  }
}

export default Config;
