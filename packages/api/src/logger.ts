import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = isDevelopment ? 'debug' : 'info';

export const logger = pino({ level: logLevel });

export default logger;
