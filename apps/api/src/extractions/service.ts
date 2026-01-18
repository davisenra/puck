import { CreateExtraction, Extraction, ExtractionList, UpdateExtraction } from './schema';
import { db } from '../database';

type ExtractionDatabaseRow = Record<string, any>;

const SELECT_ALL_SQL = 'SELECT e.* FROM extractions e ORDER BY e.id DESC';

const INSERT_SQL =
  'INSERT INTO extractions (coffee_id, brewer_id, grinder_id, grind_setting, dose, yield, brew_time, water_temp, rating, tasting_notes, recipe_metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

const DELETE_SQL = 'DELETE FROM extractions WHERE id = ?';

const UPDATE_SQL =
  'UPDATE extractions SET dose = ?, yield = ?, brew_time = ?, water_temp = ?, rating = ?, tasting_notes = ?, recipe_metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

const FIND_BY_ID_SQL = 'SELECT * FROM extractions WHERE id = ?';

function mapDatabaseRowToSchema(e: ExtractionDatabaseRow): Extraction {
  return {
    id: e.id,
    coffeeId: e.coffee_id,
    brewerId: e.brewer_id,
    grinderId: e.grinder_id,
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

async function listAll(): Promise<ExtractionList> {
  const extractions = db.query(SELECT_ALL_SQL).all() as ExtractionDatabaseRow[];
  return extractions.map(mapDatabaseRowToSchema);
}

async function save(ex: CreateExtraction): Promise<Extraction> {
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
  const row = db.query('SELECT * FROM extractions WHERE id = ?').get(id) as ExtractionDatabaseRow;
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
