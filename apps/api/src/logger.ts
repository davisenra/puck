import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = isDevelopment ? 'debug' : 'info';

const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

export const logger = pino({
  level: logLevel,
  transport,
});

export default logger;
