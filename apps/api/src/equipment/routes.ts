import { Elysia, t } from 'elysia';
import { CreateEquipmentSchema, EquipmentListSchema, EquipmentSchema } from './schema';
import EquipmentService from './service';

export default new Elysia({ prefix: '/equipment' })
  .get(
    '/',
    async () => {
      return await EquipmentService.listAll();
    },
    {
      response: {
        200: EquipmentListSchema,
      },
    },
  )
  .post(
    '/',
    async ({ body, set }) => {
      const equipment = await EquipmentService.save(body);
      set.status = 201;
      return equipment;
    },
    {
      body: CreateEquipmentSchema,
      response: {
        201: EquipmentSchema,
      },
    },
  )
  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      const equipment = await EquipmentService.find(Number(id));
      if (!equipment) {
        set.status = 404;
        return { error: 'Equipment not found' };
      }
      return equipment;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: EquipmentSchema,
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params: { id }, set }) => {
      await EquipmentService.destroy(Number(id));
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
