import { t } from 'elysia';

export const extractionSchema = t.Object({
  id: t.Optional(t.Numeric()),
  coffeeId: t.Numeric(),
  brewerId: t.Numeric(),
  grinderId: t.Nullable(t.Numeric()),
  grindSetting: t.Nullable(t.String()),
  dose: t.Numeric(),
  yield: t.Numeric(),
  brewTime: t.Numeric(),
  waterTemp: t.Nullable(t.Numeric()),
  rating: t.Numeric({ minimum: 1, maximum: 10 }),
  tastingNotes: t.Nullable(t.String()),
  recipeMetadata: t.Nullable(t.Object({}, {})),
  createdAt: t.Optional(t.Date()),
  updatedAt: t.Optional(t.Date()),
});

export type Extraction = typeof extractionSchema.static;
