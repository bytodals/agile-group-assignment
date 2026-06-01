const COLORS = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[90m',
} as const;

type Level = keyof typeof COLORS;
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(level: Level, context: string, message: string, data?: unknown): void {
  const color = COLORS[level];
  const ts = new Date().toLocaleString('sv-SE');
  const tag = `${color}${BOLD}[${level.toUpperCase().padEnd(5)}]${RESET}`;
  const prefix = `${tag} [${ts}] [${context}]`;
  if (data !== undefined) {
    (level === 'error' ? console.error : console.log)(`${prefix} ${message}`, data);
  } else {
    (level === 'error' ? console.error : console.log)(`${prefix} ${message}`);
  }
}

export const logger = {
  info: (ctx: string, msg: string, data?: unknown) => log('info', ctx, msg, data),
  warn: (ctx: string, msg: string, data?: unknown) => log('warn', ctx, msg, data),
  error: (ctx: string, msg: string, data?: unknown) => log('error', ctx, msg, data),
  debug: (ctx: string, msg: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') log('debug', ctx, msg, data);
  },
};
