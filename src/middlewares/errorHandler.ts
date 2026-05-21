import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const handleCastError = (err: mongoose.Error.CastError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKey = (err: MongoError): AppError => {
  const field = Object.keys(err.keyValue ?? {})[0];
  return new AppError(`Duplicate value for field: ${field}`, 409);
};

const handleValidationError = (err: mongoose.Error.ValidationError): AppError => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

const errorHandler = (
  err: AppError & MongoError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError = Object.assign(new AppError(err.message, err.statusCode ?? 500), err);

  if (err instanceof mongoose.Error.CastError) error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationError(err);

  if (!error.isOperational) {
    logger.error('Unexpected error', { err, url: req.originalUrl, method: req.method });
  }

  const body: Record<string, unknown> = {
    status: error.status,
    message: error.message,
  };

  if (process.env.NODE_ENV === 'development') {
    body.stack = error.stack;
  }

  res.status(error.statusCode).json(body);
};

export default errorHandler;
