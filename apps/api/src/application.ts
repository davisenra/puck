import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import equipmentRoutes from './equipment/routes';
import coffeesRoutes from './coffees/routes';
import extractionsRoutes from './extractions/routes';

export async function createElysiaApplication() {
  return new Elysia()
    .use(openapi())
    .use(equipmentRoutes)
    .use(coffeesRoutes)
    .use(extractionsRoutes)
    .get('/', () => '☕');
}
