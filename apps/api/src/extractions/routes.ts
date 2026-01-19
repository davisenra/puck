import { Elysia, t } from 'elysia';

import {
  CreateExtractionSchema,
  ExtractionListSchema,
  ExtractionSchema,
  UpdateExtractionSchema,
} from './schema';
import ExtractionService from './service';

export default new Elysia({ prefix: '/extractions' })
  .get(
    '/',
    async () => {
      return await ExtractionService.listAll();
    },
    {
      response: {
        200: ExtractionListSchema,
      },
    },
  )
  .post(
    '/',
    async ({ body, set }) => {
      const extraction = await ExtractionService.save(body);
      set.status = 201;
      return extraction;
    },
    {
      body: CreateExtractionSchema,
      response: {
        201: ExtractionSchema,
        400: t.Object({ error: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params: { id }, set }) => {
      const extraction = await ExtractionService.find(Number(id));
      if (!extraction) {
        set.status = 404;
        return { error: 'Extraction not found' };
      }
      return extraction;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: ExtractionSchema,
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params: { id }, body, set }) => {
      const extraction = await ExtractionService.update(Number(id), body);
      if (!extraction) {
        set.status = 404;
        return { error: 'Extraction not found' };
      }
      return extraction;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateExtractionSchema,
      response: {
        200: ExtractionSchema,
        400: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params: { id }, set }) => {
      await ExtractionService.destroy(Number(id));
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
