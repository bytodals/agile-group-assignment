import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SPINNER_MIN_MS = 700;

const connectDB = async (): Promise<void> => {
  const useLocal = process.env.USE_LOCAL_DB === 'true';
  const uri = useLocal
    ? (process.env.MONGODB_LOCAL_URI ?? 'mongodb://localhost:27017/ennabook')
    : process.env.MONGODB_URI;

  if (!uri) {
    logger.error('db', 'MONGODB_URI is not set — set it in .env');
    process.exit(1);
  }

  const label = `${useLocal ? 'local' : 'Atlas'} MongoDB`;
  const started = Date.now();
  let frame = 0;
  const spinner = setInterval(() => {
    process.stdout.write(
      `\r  ${SPINNER_FRAMES[frame++ % SPINNER_FRAMES.length]} Connecting to ${label}...`,
    );
  }, 80);

  try {
    await mongoose.connect(uri);
    const elapsed = Date.now() - started;
    if (elapsed < SPINNER_MIN_MS) {
      await new Promise((r) => setTimeout(r, SPINNER_MIN_MS - elapsed));
    }
    clearInterval(spinner);
    process.stdout.write('\r\x1b[K');
    logger.info('db', `Connected to ${label} ✔`);
  } catch (error) {
    clearInterval(spinner);
    process.stdout.write('\r\x1b[K');
    logger.error('db', `Failed to connect to ${label} ✖`, error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info('db', 'Connection closed');
};

export default connectDB;
