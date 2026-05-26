import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import connectDB from './config/db.js';
import authorRoutes from './routes/authorRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import openLibraryRoutes from './routes/openLibraryRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

type RouteLayer = {
  route?: { path: string; methods: Record<string, boolean> };
};

const routeList = routeDefs.flatMap(({ prefix, router }) =>
  (router.stack as RouteLayer[])
    .filter((l) => l.route)
    .map((l) => {
      const methods = Object.keys(l.route!.methods)
        .map((m) => m.toUpperCase())
        .join(',');
      return `  ${methods.padEnd(7)} ${prefix}${l.route!.path}`;
    }),
);

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface ?? []) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'localhost';
};

connectDB().then(() => {
  app.listen(PORT, () => {
    const ip = getLocalIP();
    console.log('\n  EnnaBook API');
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Network: http://${ip}:${PORT}`);
    console.log('\n  Routes:');
    routeList.forEach((r) => console.log(r));
    console.log('');
  });
});

export default app;
