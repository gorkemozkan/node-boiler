import app from './app';
import Config from './utils/config';
import { prisma } from './config/database';

Config.validateProductionConfig();

const server = app.listen(Config.server.port, () => {
  console.log(`Server running on port ${Config.server.port} in ${Config.server.nodeEnv} mode`);
  console.log(`Health check: http://localhost:${Config.server.port}${Config.server.apiPrefix}/health`);
  
  if (Config.isDevelopment) {
    console.log(`Configuration summary:`, Config.getSummary());
  }
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
