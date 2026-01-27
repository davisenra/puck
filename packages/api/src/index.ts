import { loadMigrations, runMigrations } from '../scripts/migrations';
import { createElysiaApplication } from './application';
import { close } from './database';
import { db } from './database';
import logger from './logger';

async function main(): Promise<void> {
  logger.info('Running migrations...');
  await runMigrations(db, await loadMigrations());
  logger.info('Migrations completed');

  const app = await createElysiaApplication();

  app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);

  logger.info(`Server started: http://localhost:${process.env.PORT || 3000}`);

  const shutdown = (signal: string) => {
    logger.info(`Server shutting down with signal: ${signal}`);
    app.stop();
    close();
    logger.info('Server closed');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

await main();
