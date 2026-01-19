import { t } from 'elysia';

export const EquipmentReferenceSchema = t.Object({
  id: t.Numeric(),
  name: t.String(),
});

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
  brewer: EquipmentReferenceSchema,
  grinder: t.Nullable(EquipmentReferenceSchema),
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

export const PaginationMetaSchema = t.Object({
  total: t.Numeric(),
  page: t.Numeric(),
  perPage: t.Numeric(),
  totalPages: t.Numeric(),
});

export const PaginatedExtractionsSchema = t.Object({
  data: ExtractionListSchema,
  meta: PaginationMetaSchema,
});

export const PaginationParamsSchema = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1 })),
  perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
});

export type Extraction = typeof ExtractionSchema.static;
export type CreateExtraction = typeof CreateExtractionSchema.static;
export type UpdateExtraction = typeof UpdateExtractionSchema.static;
export type ExtractionList = typeof ExtractionListSchema.static;
export type EquipmentReference = typeof EquipmentReferenceSchema.static;
export type PaginationMeta = typeof PaginationMetaSchema.static;
export type PaginatedExtractions = typeof PaginatedExtractionsSchema.static;
export type PaginationParams = typeof PaginationParamsSchema.static;
