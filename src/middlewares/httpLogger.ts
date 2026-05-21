import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
      ...(req.method !== 'GET' && { body: sanitizeBody(req.body) }),
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP request', meta);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP request', meta);
    } else {
      logger.http('HTTP request', meta);
    }
  });

  next();
};

// Strip sensitive fields before logging
const sensitiveFields = new Set(['password', 'token', 'secret', 'authorization', 'creditCard']);

function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  if (!body || typeof body !== 'object') return body;
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, sensitiveFields.has(k.toLowerCase()) ? '[REDACTED]' : v])
  );
}

export default httpLogger;
