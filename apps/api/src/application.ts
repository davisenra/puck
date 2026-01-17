import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import equipmentRoutes from './equipment/routes';
import coffeesRoutes from './coffees/routes';

export async function createElysiaApplication() {
  return new Elysia()
    .use(openapi())
    .use(equipmentRoutes)
    .use(coffeesRoutes)
    .get('/', () => '☕');
}
