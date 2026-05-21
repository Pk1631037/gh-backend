import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables');

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  logger.info('MongoDB connected');

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
};

export default connectDB;
