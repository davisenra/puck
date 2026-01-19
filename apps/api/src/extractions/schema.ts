import { t } from 'elysia';

export const ExtractionSchema = t.Object({
  id: t.Numeric(),
  coffeeId: t.Numeric(),
  brewerId: t.Numeric(),
  grinderId: t.Nullable(t.Numeric()),
  grindSetting: t.Nullable(t.String()),
  dose: t.Numeric(),
  yield: t.Numeric(),
  brewTime: t.Numeric(),
  waterTemp: t.Nullable(t.Numeric()),
  rating: t.Numeric({ minimum: 1, maximum: 5 }),
  tastingNotes: t.Nullable(t.String()),
  recipeMetadata: t.Nullable(t.Object({}, {})),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const CreateExtractionSchema = t.Object({
  coffeeId: t.Numeric(),
  brewerId: t.Numeric(),
  grinderId: t.Nullable(t.Numeric()),
  grindSetting: t.Nullable(t.String()),
  dose: t.Numeric(),
  yield: t.Numeric(),
  brewTime: t.Numeric(),
  waterTemp: t.Nullable(t.Numeric()),
  rating: t.Numeric({ minimum: 1, maximum: 5 }),
  tastingNotes: t.Nullable(t.String()),
  recipeMetadata: t.Nullable(t.Object({}, {})),
});

export const UpdateExtractionSchema = t.Object({
  dose: t.Optional(t.Numeric()),
  yield: t.Optional(t.Numeric()),
  brewTime: t.Optional(t.Numeric()),
  waterTemp: t.Optional(t.Nullable(t.Numeric())),
  rating: t.Optional(t.Numeric({ minimum: 1, maximum: 10 })),
  tastingNotes: t.Optional(t.Nullable(t.String())),
  recipeMetadata: t.Optional(t.Nullable(t.Object({}, {}))),
});

export const ExtractionListSchema = t.Array(ExtractionSchema);

export type Extraction = typeof ExtractionSchema.static;
export type CreateExtraction = typeof CreateExtractionSchema.static;
export type UpdateExtraction = typeof UpdateExtractionSchema.static;
export type ExtractionList = typeof ExtractionListSchema.static;
