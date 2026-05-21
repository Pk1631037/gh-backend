import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import logger from './src/config/logger.js';
import Shutdown from './src/shutdown.js';

const PORT = process.env.PORT ?? '3000';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION — shutting down', { err });
  process.exit(1);
});

const start = async (): Promise<void> => {
  try {
    await connectDB();
    logger.info('Starting server...');
    const server = app.listen(PORT, () =>
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
    );

    process.on('unhandledRejection', (err: unknown) => {
      logger.error('UNHANDLED REJECTION — shutting down', { err });
      server.close(() => process.exit(1));
    });

    new Shutdown(server).register();
  } catch (err) {
    logger.error('DB connection failed — shutting down', { err });
    process.exit(1);
  }
};

start();
