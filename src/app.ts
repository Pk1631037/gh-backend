import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpLogger from './middlewares/httpLogger.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import AppError from './utils/AppError.js';
import healthRoutes from './routes/healthRoutes.js';

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }));
app.use(httpLogger);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(globalLimiter);

app.use('/health', healthRoutes);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
