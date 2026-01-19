import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';

import coffeesRoutes from './coffees/routes';
import equipmentRoutes from './equipment/routes';
import { ApplicationError } from './errors';
import extractionsRoutes from './extractions/routes';

export async function createElysiaApplication() {
  return new Elysia()
    .onError(({ error, set }) => {
      if (error instanceof ApplicationError) {
        set.status = error.status;
        return { error: error.message };
      }
      return { error: 'Internal server error' };
    })
    .use(openapi())
    .use(equipmentRoutes)
    .use(coffeesRoutes)
    .use(extractionsRoutes)
    .get('/', () => '☕');
}
