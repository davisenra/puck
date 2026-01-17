import { t } from 'elysia';

export const CoffeeSchema = t.Object({
  id: t.Numeric(),
  roaster: t.String({ minLength: 1 }),
  name: t.String({ minLength: 1 }),
  roastDate: t.Nullable(t.Date()),
  process: t.Nullable(t.String()),
  notes: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const CreateCoffeeSchema = t.Object({
  roaster: t.String({ minLength: 1 }),
  name: t.String({ minLength: 1 }),
  roastDate: t.Nullable(t.Date()),
  process: t.Nullable(t.String()),
  notes: t.Nullable(t.String()),
});

export const CoffeeListSchema = t.Array(CoffeeSchema);

export type Coffee = typeof CoffeeSchema.static;
export type CreateCoffee = typeof CreateCoffeeSchema.static;
export type CoffeeList = typeof CoffeeListSchema.static;
