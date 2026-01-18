import { t } from 'elysia';

export const CoffeeSchema = t.Object({
  id: t.Numeric(),
  roaster: t.String({ minLength: 1 }),
  name: t.String({ minLength: 1 }),
  roastDate: t.Nullable(t.Date()),
  process: t.Nullable(t.String()),
  notes: t.Nullable(t.String()),
  archived: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const CreateCoffeeSchema = t.Object({
  roaster: t.String({ minLength: 1 }),
  name: t.String({ minLength: 1 }),
  roastDate: t.Nullable(t.Date()),
  process: t.Nullable(t.String()),
  notes: t.Nullable(t.String()),
  archived: t.Optional(t.Boolean()),
});

export const UpdateCoffeeSchema = t.Object({
  roaster: t.Optional(t.String({ minLength: 1 })),
  name: t.Optional(t.String({ minLength: 1 })),
  roastDate: t.Optional(t.Nullable(t.Date())),
  process: t.Optional(t.Nullable(t.String())),
  notes: t.Optional(t.Nullable(t.String())),
  archived: t.Optional(t.Boolean()),
});

export const CoffeeListSchema = t.Array(CoffeeSchema);

export type Coffee = typeof CoffeeSchema.static;
export type CreateCoffee = typeof CreateCoffeeSchema.static;
export type UpdateCoffee = typeof UpdateCoffeeSchema.static;
export type CoffeeList = typeof CoffeeListSchema.static;
