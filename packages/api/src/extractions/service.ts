import CoffeeService from '../coffees/service';
import { db } from '../database';
import EquipmentService from '../equipment/service';
import { ValidationError } from '../errors';
import {
  CreateExtraction,
  Extraction,
  PaginatedExtractions,
  PaginationMeta,
  PaginationParams,
  UpdateExtraction,
} from './schema';

type ExtractionDatabaseRow = Record<string, any>;

const SELECT_ALL_SQL = `SELECT
  e.*,
  c.id as coffee_id,
  c.name as coffee_name,
  b.id as brewer_id_ref,
  b.name as brewer_name,
  g.id as grinder_id_ref,
  g.name as grinder_name
FROM extractions e
LEFT JOIN equipment b ON e.brewer_id = b.id
LEFT JOIN equipment g ON e.grinder_id = g.id
LEFT JOIN coffees c ON e.coffee_id = c.id
ORDER BY e.id DESC`;

const COUNT_SQL = 'SELECT COUNT(*) as total FROM extractions e';

const INSERT_SQL =
  'INSERT INTO extractions (coffee_id, brewer_id, grinder_id, grind_setting, dose, yield, brew_time, water_temp, rating, tasting_notes, recipe_metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

const DELETE_SQL = 'DELETE FROM extractions WHERE id = ?';

const UPDATE_SQL =
  'UPDATE extractions SET dose = ?, yield = ?, brew_time = ?, water_temp = ?, rating = ?, tasting_notes = ?, recipe_metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

const FIND_BY_ID_SQL = `SELECT
  e.*,
  c.id as coffee_id,
  c.name as coffee_name,
  b.id as brewer_id_ref,
  b.name as brewer_name,
  g.id as grinder_id_ref,
  g.name as grinder_name
FROM extractions e
LEFT JOIN equipment b ON e.brewer_id = b.id
LEFT JOIN equipment g ON e.grinder_id = g.id
LEFT JOIN coffees c ON e.coffee_id = c.id
WHERE e.id = ?`;

function mapDatabaseRowToSchema(e: ExtractionDatabaseRow): Extraction {
  return {
    id: e.id,
    coffee: {
      id: e.coffee_id,
      name: e.coffee_name,
    },
    brewer: {
      id: e.brewer_id_ref,
      name: e.brewer_name,
    },
    grinder: e.grinder_id_ref
      ? {
          id: e.grinder_id_ref,
          name: e.grinder_name,
        }
      : null,
    grindSetting: e.grind_setting,
    dose: e.dose,
    yield: e.yield,
    brewTime: e.brew_time,
    waterTemp: e.water_temp,
    rating: e.rating,
    tastingNotes: e.tasting_notes,
    recipeMetadata: e.recipe_metadata ? JSON.parse(e.recipe_metadata) : null,
    createdAt: new Date(e.created_at),
    updatedAt: new Date(e.updated_at),
  };
}

async function listAll(params?: PaginationParams): Promise<PaginatedExtractions> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 25;

  const countResult = db.query(COUNT_SQL).get() as { total: number };
  const total = countResult.total;
  const totalPages = Math.ceil(total / perPage);
  const offset = (page - 1) * perPage;

  const paginatedSql = `${SELECT_ALL_SQL} LIMIT ? OFFSET ?`;
  const extractions = db.query(paginatedSql).all(perPage, offset) as ExtractionDatabaseRow[];
  const data = extractions.map(mapDatabaseRowToSchema);

  const meta: PaginationMeta = {
    total,
    page,
    perPage,
    totalPages,
  };

  return { data, meta };
}

async function save(ex: CreateExtraction): Promise<Extraction> {
  const coffee = await CoffeeService.find(ex.coffeeId);
  if (!coffee) {
    throw new ValidationError('Coffee not found');
  }

  const brewer = await EquipmentService.find(ex.brewerId);
  if (!brewer) {
    throw new ValidationError('Brewer not found');
  }
  if (brewer.type !== 'BREWER') {
    throw new ValidationError('Equipment must be of type BREWER');
  }

  if (ex.grinderId !== null) {
    const grinder = await EquipmentService.find(ex.grinderId);
    if (!grinder) {
      throw new ValidationError('Grinder not found');
    }
    if (grinder.type !== 'GRINDER') {
      throw new ValidationError('Equipment must be of type GRINDER');
    }
  }

  const result = db
    .query(INSERT_SQL)
    .run(
      ex.coffeeId,
      ex.brewerId,
      ex.grinderId,
      ex.grindSetting,
      ex.dose,
      ex.yield,
      ex.brewTime,
      ex.waterTemp,
      ex.rating,
      ex.tastingNotes,
      ex.recipeMetadata ? JSON.stringify(ex.recipeMetadata) : null,
    );
  const id = result.lastInsertRowid;
  const row = db.query(FIND_BY_ID_SQL).get(id) as ExtractionDatabaseRow;
  return mapDatabaseRowToSchema(row);
}

async function destroy(id: number): Promise<void> {
  db.query(DELETE_SQL).run(id);
}

async function update(id: number, updates: UpdateExtraction): Promise<Extraction | undefined> {
  const existing = await find(id);
  if (!existing) {
    return undefined;
  }

  const coffee = await CoffeeService.find(existing.coffee.id);
  if (!coffee) {
    throw new ValidationError('Coffee not found');
  }

  const brewer = await EquipmentService.find(existing.brewer.id);
  if (!brewer) {
    throw new ValidationError('Brewer not found');
  }
  if (brewer.type !== 'BREWER') {
    throw new ValidationError('Equipment must be of type BREWER');
  }

  if (existing?.grinder !== null) {
    const grinder = await EquipmentService.find(existing.grinder.id);
    if (!grinder) {
      throw new ValidationError('Grinder not found');
    }
    if (grinder.type !== 'GRINDER') {
      throw new ValidationError('Equipment must be of type GRINDER');
    }
  }

  db.query(UPDATE_SQL).run(
    updates.dose ?? existing.dose,
    updates.yield ?? existing.yield,
    updates.brewTime ?? existing.brewTime,
    updates.waterTemp !== undefined ? updates.waterTemp : existing.waterTemp,
    updates.rating ?? existing.rating,
    updates.tastingNotes !== undefined ? updates.tastingNotes : existing.tastingNotes,
    updates.recipeMetadata !== undefined
      ? updates.recipeMetadata
        ? JSON.stringify(updates.recipeMetadata)
        : null
      : existing.recipeMetadata
        ? JSON.stringify(existing.recipeMetadata)
        : null,
    id,
  );

  return await find(id);
}

async function find(id: number): Promise<Extraction | undefined> {
  const row = db.query(FIND_BY_ID_SQL).get(id) as ExtractionDatabaseRow | undefined;
  return row ? mapDatabaseRowToSchema(row) : undefined;
}

export default { listAll, save, destroy, find, update };
