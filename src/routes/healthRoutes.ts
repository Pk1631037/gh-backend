import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import redis from '../config/redis.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
  let redisStatus = 'down';

  try {
    await redis.ping();
    redisStatus = 'up';
  } catch { /* stays 'down' */ }

  const healthy = mongoStatus === 'up' && redisStatus === 'up';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: { mongo: mongoStatus, redis: redisStatus },
  });
});

export default router;
