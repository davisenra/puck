import { Elysia, t } from 'elysia';
import { CreateCoffeeSchema, UpdateCoffeeSchema, CoffeeListSchema, CoffeeSchema } from './schema';
import CoffeeService from './service';

export default new Elysia({ prefix: '/coffees' })
  .get(
    '/',
    async () => {
      return await CoffeeService.listAll();
    },
    {
      response: {
        200: CoffeeListSchema,
      },
    },
  )
  .post(
    '/',
    async ({ body, set }) => {
      const coffee = await CoffeeService.save(body);
      set.status = 201;
      return coffee;
    },
    {
      body: CreateCoffeeSchema,
      response: {
        201: CoffeeSchema,
      },
    },
  )
  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      const coffee = await CoffeeService.find(Number(id));
      if (!coffee) {
        set.status = 404;
        return { error: 'Coffee not found' };
      }
      return coffee;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: CoffeeSchema,
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params: { id }, body, set }) => {
      const coffee = await CoffeeService.update(Number(id), body);
      if (!coffee) {
        set.status = 404;
        return { error: 'Coffee not found' };
      }
      return coffee;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateCoffeeSchema,
      response: {
        200: CoffeeSchema,
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params: { id }, set }) => {
      await CoffeeService.destroy(Number(id));
      set.status = 204;
      return;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        204: t.Undefined(),
      },
    },
  );
