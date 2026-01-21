import { createElysiaApplication } from './application';
import { close } from './database';
import logger from './logger';

export * from './types';

async function main(): Promise<void> {
  const app = await createElysiaApplication();

  app.listen(3000);

  logger.info(`Server started: http://localhost:3000`);

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
