import { Server } from 'http';
import mongoose from 'mongoose';
import redis from './config/redis.js';
import logger from './config/logger.js';

export default class Shutdown {
  private server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  register(): void {
    (['SIGTERM', 'SIGINT'] as NodeJS.Signals[]).forEach((signal) => {
      process.on(signal, () => this.graceful(signal));
    });
  }

  private graceful(signal: string): void {
    logger.info(`${signal} received — starting graceful shutdown`);

    this.server.close(async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');

        await redis.quit();
        logger.info('Redis connection closed');

        logger.info('Graceful shutdown complete');
        process.exit(0);
      } catch (err) {
        logger.error('Error during graceful shutdown', { err });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  }
}
