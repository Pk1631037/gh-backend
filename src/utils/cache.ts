import redis from '../config/redis.js';
import logger from '../config/logger.js';

const DEFAULT_TTL = parseInt(process.env.CACHE_TTL ?? '300');

const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (err) {
      logger.warn('Cache GET failed — bypassing cache', { err, key });
      return null;
    }
  },

  async set(key: string, value: unknown, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
      logger.warn('Cache SET failed — continuing without cache', { err, key });
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (err) {
      logger.warn('Cache DEL failed', { err, key });
    }
  },

  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(...keys);
    } catch (err) {
      logger.warn('Cache pattern DEL failed', { err, pattern });
    }
  },
};

export default cache;
