import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { staticPlugin as serveStatic } from '@elysiajs/static';
import { Elysia, file } from 'elysia';

import coffeesRoutes from './coffees/routes';
import { db } from './database';
import equipmentRoutes from './equipment/routes';
import { ApplicationError } from './errors';
import extractionsRoutes from './extractions/routes';
import logger from './logger';

type ApiError = {
  error: string;
  exception?: Error;
};

export async function createElysiaApplication() {
  return new Elysia()
    .onError(({ error, set }) => {
      if (error instanceof ApplicationError) {
        set.status = error.status;
        return { error: error.message } as ApiError;
      }
      logger.error(`Internal error: ${error}`);
      const response: ApiError = { error: 'Internal server error' };
      if (process.env.NODE_ENV !== 'production') {
        response.exception = error as Error;
      }
      return response;
    })
    .use(cors())
    .use(openapi())
    .use(equipmentRoutes)
    .use(coffeesRoutes)
    .use(extractionsRoutes)
    .get('/api', () => '☕')
    .get('/health', () => {
      try {
        db.query('SELECT 1').get();
        return { alive: true };
      } catch (e) {
        logger.error(e);
        return { alive: false };
      }
    })
    .get('/', () => file('./public/index.html'))
    .use(
      serveStatic({
        assets: 'public',
        prefix: '',
      }),
    );
}
