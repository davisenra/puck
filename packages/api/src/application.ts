import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';

import coffeesRoutes from './coffees/routes';
import { db } from './database';
import equipmentRoutes from './equipment/routes';
import { ApplicationError } from './errors';
import extractionsRoutes from './extractions/routes';
import logger from './logger';

export async function createElysiaApplication() {
  return new Elysia()
    .onError(({ error, set }) => {
      if (error instanceof ApplicationError) {
        set.status = error.status;
        return { error: error.message };
      }
      logger.error(`Internal error: ${error}`);
      return { error: 'Internal server error' };
    })
    .use(cors())
    .use(openapi())
    .use(equipmentRoutes)
    .use(coffeesRoutes)
    .use(extractionsRoutes)
    .get('/', () => '☕')
    .get('/health', () => {
      try {
        db.query('SELECT 1').get();
        return { alive: true };
      } catch (e) {
        logger.error(e);
        return { alive: false };
      }
    });
}
