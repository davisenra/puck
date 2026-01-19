import { t } from 'elysia';

export const EquipmentType = t.Union([t.Literal('GRINDER'), t.Literal('BREWER')]);

export const EquipmentSchema = t.Object({
  id: t.Numeric(),
  name: t.String({ minLength: 1 }),
  type: EquipmentType,
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const CreateEquipmentSchema = t.Object({
  name: t.String({ minLength: 1 }),
  type: EquipmentType,
});

export const EquipmentListSchema = t.Array(EquipmentSchema);

export const EquipmentFilterParamsSchema = t.Object({
  type: t.Optional(EquipmentType),
});

export type Equipment = typeof EquipmentSchema.static;
export type EquipmentList = typeof EquipmentListSchema.static;
export type CreateEquipment = typeof CreateEquipmentSchema.static;
export type EquipmentFilterParams = typeof EquipmentFilterParamsSchema.static;
