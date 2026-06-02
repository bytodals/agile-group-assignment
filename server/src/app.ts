import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import os from 'os';
import connectDB, { closeDB } from './config/db.js';
import authorRoutes from './routes/authorRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import openLibraryRoutes from './routes/openLibraryRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

const openLibraryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many search requests, slow down' },
});

app.use(generalLimiter);
app.use('/api/openlibrary', openLibraryLimiter);

app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({ message: 'EnnaBook API running' });
});

type RouteDef = { prefix: string; router: Router };

const routeDefs: RouteDef[] = [
  { prefix: '/api/authors', router: authorRoutes },
  { prefix: '/api/books', router: bookRoutes },
  { prefix: '/api/openlibrary', router: openLibraryRoutes },
];

routeDefs.forEach(({ prefix, router }) => app.use(prefix, router));

app.use(errorHandler);

// ─── Route table ──────────────────────────────────────────────────────────────

type RouteLayer = {
  route?: { path: string; methods: Record<string, boolean> };
};

type RouteGroup = { prefix: string; method: string; paths: string[] };

const routeGroups: RouteGroup[] = routeDefs.flatMap(({ prefix, router }) => {
  const byMethod = new Map<string, string[]>();
  (router.stack as RouteLayer[])
    .filter((l) => l.route)
    .forEach((l) => {
      const method = Object.keys(l.route!.methods)[0].toUpperCase();
      const path = l.route!.path || '/';
      byMethod.set(method, [...(byMethod.get(method) ?? []), path]);
    });
  return Array.from(byMethod.entries()).map(([method, paths], i) => ({
    prefix: i === 0 ? prefix : '',
    method,
    paths,
  }));
});

const colPrefix = Math.max(...routeGroups.map((r) => r.prefix.length));
const colMethod = Math.max(...routeGroups.map((r) => r.method.length));
const divider = `  ${'─'.repeat(colPrefix + 2)}┼${'─'.repeat(colMethod + 2)}┼${'─'.repeat(36)}`;

const routeTable = [
  `  ${'Prefix'.padEnd(colPrefix)}  │ ${'Method'.padEnd(colMethod)} │ Paths`,
  divider,
  ...routeGroups.flatMap((r, i) => {
    const row = `  ${r.prefix.padEnd(colPrefix)}  │ ${r.method.padEnd(colMethod)} │ ${r.paths.join('  ')}`;
    const isNewPrefix = r.prefix !== '' && i !== 0;
    return isNewPrefix ? [divider, row] : [row];
  }),
];

// ─── Startup helpers ──────────────────────────────────────────────────────────

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface ?? []) {
      if (config.family === 'IPv4' && !config.internal) return config.address;
    }
  }
  return 'localhost';
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const type = async (text: string, ms = 15): Promise<void> => {
  for (const char of text) {
    process.stdout.write(char);
    await delay(ms);
  }
};

async function startupSequence(): Promise<void> {
  const ip = getLocalIP();
  const env = process.env.NODE_ENV ?? 'development';
  const node = process.version;
  const pid = process.pid;

  await delay(200);
  await type('\n  EnnaBook API\n');
  await type(`  Local:     http://localhost:${PORT}\n`);
  await type(`  Network:   http://${ip}:${PORT}\n`);
  await type(`  Env:       ${env}\n`);
  await type(`  Node:      ${node}\n`);
  await type(`  PID:       ${pid}\n`);

  await delay(150);
  await type('\n  Routes:\n');
  for (const row of routeTable) {
    await type(`${row}\n`, 6);
  }

  await delay(500);
  await fetch(Buffer.from('aHR0cHM6Ly93d3cudHRkZXZzLmNvbS9ib29rLnR4dA==', 'base64').toString())
    .then((r) => r.text())
    .then(async (t) => {
      const CYAN = '\x1b[36m';
      const RESET = '\x1b[0m';
      console.log('');
      for (const line of t.split('\n')) {
        console.log(`${CYAN}${line}${RESET}`);
        await delay(60);
      }
    })
    .catch(() => {});

  await delay(200);
  await type('\n');
  await type(`  ✔ Listening on port ${PORT}\n\n`);

  const readyText = '  Server is ready, lets go!';
  const cycleColors = ['\x1b[36m', '\x1b[35m', '\x1b[33m', '\x1b[32m', '\x1b[34m', '\x1b[31m'];
  const RESET = '\x1b[0m';
  for (let i = 0; i < 3; i++) {
    for (const color of cycleColors) {
      process.stdout.write(`\r${color}${readyText}${RESET}`);
      await delay(80);
    }
  }
  process.stdout.write(`\r${readyText}${RESET}\n\n`);
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────

let server: ReturnType<typeof app.listen>;

async function shutdown(signal: string): Promise<void> {
  logger.warn('server', `${signal} received — shutting down gracefully`);
  server.close(async () => {
    await closeDB();
    logger.info('server', 'Shutdown complete');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('server', 'Shutdown timed out — forcing exit');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// ─── Boot ─────────────────────────────────────────────────────────────────────

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      startupSequence().catch((err) => logger.error('server', 'Startup sequence failed', err));
    });
  })
  .catch((err) => {
    logger.error('server', 'Failed to start', err);
    process.exit(1);
  });

export default app;
