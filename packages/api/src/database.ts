import { Database } from 'bun:sqlite';

import logger from './logger';

export let db = new Database(process.env.DATABASE_PATH ?? ':memory:');
logger.debug('Database connected');

export function useTestDatabase(): void {
  db.close();
  db = new Database(':memory:');
}

export function close(): void {
  logger.debug('Closing database connection');
  db.close();
  logger.info('Database closed');
}
