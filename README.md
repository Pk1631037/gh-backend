# gh-backend

Production-ready Node.js REST API skeleton — Express · MongoDB · Redis · PM2

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 18+ (ESM) |
| Framework | Express 4 |
| Database | MongoDB via Mongoose |
| Cache / Rate-limit store | Redis via ioredis |
| Process manager | PM2 (cluster mode) |
| Validation | Zod (ready to use) |
| Logging | Winston + Morgan |
| Security | Helmet, CORS, express-rate-limit |
| Reverse proxy | Nginx (nginx.conf included) |

## Folder structure

```
├── index.js                  Entry point + uncaughtException/unhandledRejection handlers
├── ecosystem.config.js       PM2 cluster config
├── nginx.conf                Nginx reverse-proxy + TLS config
├── src/
│   ├── app.js                Express app — middleware stack, routes, error handler
│   ├── shutdown.js           Graceful shutdown on SIGTERM/SIGINT
│   ├── config/
│   │   ├── db.js             Mongoose connect
│   │   ├── logger.js         Winston (colorized dev / JSON prod)
│   │   └── redis.js          ioredis client with retry strategy
│   ├── routes/
│   │   └── healthRoutes.js   GET /health
│   ├── middlewares/
│   │   ├── errorHandler.js   Centralized error middleware (Mongoose + JWT errors mapped)
│   │   └── rateLimiter.js    Global 200/15m — Redis-backed
│   └── utils/
│       ├── AppError.js       isOperational custom error class
│       ├── catchAsync.js     Async controller wrapper
│       └── cache.js          get · set · del · delByPattern helpers
```

## Setup

```bash
cp .env.example .env   # fill in MONGO_URI, REDIS_*, JWT_SECRET
npm install
```

## Run

```bash
npm run dev            # nodemon
npm start              # plain node
npm run prod           # PM2 cluster
npm run prod:reload    # zero-downtime reload
npm run prod:logs
npm run prod:stop
```

## Health check

```
GET /health
→ { status, uptime, timestamp, services: { mongo, redis } }
   HTTP 200 if both up, 503 if either is down
```

## Adding a feature

1. Create `src/models/YourModel.js`
2. Create `src/services/yourService.js` — use `cache` helpers for cache-aside
3. Create `src/controllers/yourController.js` — wrap handlers with `catchAsync`
4. Create `src/routes/yourRoutes.js`
5. Mount in `src/app.js`: `app.use('/api/v1/your', yourRoutes)`
6. Throw `new AppError('message', statusCode)` for known errors — the error handler will catch them

## Rate limiting

| Route | Window | Limit |
|---|---|---|
| All routes | 15 min | 200 req |

Redis-backed so limits are shared across all PM2 cluster workers.

## Load balancing

PM2 cluster mode (one worker per CPU core) + stateless design (all state in MongoDB/Redis). Nginx config included for TLS termination and `least_conn` upstream balancing.
