import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import equipmentRoutes from './equipment/routes';
import coffeesRoutes from './coffees/routes';
import extractionsRoutes from './extractions/routes';
import { HttpError } from './errors';

export async function createElysiaApplication() {
  return new Elysia()
    .onError(({ error, set }) => {
      if (error instanceof HttpError) {
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
