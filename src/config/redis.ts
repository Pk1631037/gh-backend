import Redis from 'ioredis';
import logger from './logger.js';

const redis = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT ?? '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB ?? '0'),
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => Math.min(times * 100, 3000),
  lazyConnect: true,
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err: Error) => logger.error('Redis error', { err }));
redis.on('reconnecting', () => logger.warn('Redis reconnecting'));

export default redis;
