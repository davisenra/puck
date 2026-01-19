import { Coffee, CoffeeList, CreateCoffee, UpdateCoffee } from './schema';
import { db } from '../database';

type CoffeeDatabaseRow = Record<string, any>;

const SELECT_ALL_SQL = 'SELECT c.* FROM coffees c ORDER BY c.id DESC';

const INSERT_SQL =
  'INSERT INTO coffees (roaster, name, roast_date, process, notes, archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

const UPDATE_SQL =
  'UPDATE coffees SET roaster = ?, name = ?, roast_date = ?, process = ?, notes = ?, archived = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

const DELETE_SQL = 'DELETE FROM coffees WHERE id = ?';

const FIND_BY_ID_SQL = 'SELECT * FROM coffees WHERE id = ?';

function mapDatabaseRowToSchema(c: CoffeeDatabaseRow): Coffee {
  return {
    id: c.id,
    roaster: c.roaster,
    name: c.name,
    roastDate: c.roast_date ? new Date(c.roast_date) : null,
    process: c.process,
    notes: c.notes,
    archived: Boolean(c.archived),
    createdAt: new Date(c.created_at),
    updatedAt: new Date(c.updated_at),
  };
}

async function listAll(): Promise<CoffeeList> {
  const coffees = db.query(SELECT_ALL_SQL).all() as CoffeeDatabaseRow[];
  return coffees.map(mapDatabaseRowToSchema);
}

async function save(coffee: CreateCoffee): Promise<Coffee> {
  const result = db
    .query(INSERT_SQL)
    .run(
      coffee.roaster,
      coffee.name,
      coffee.roastDate ? coffee.roastDate.toISOString() : null,
      coffee.process || null,
      coffee.notes || null,
      coffee.archived ? 1 : 0,
    );
  const id = result.lastInsertRowid;
  const row = db.query(FIND_BY_ID_SQL).get(id) as CoffeeDatabaseRow;
  return mapDatabaseRowToSchema(row);
}

async function destroy(id: number): Promise<void> {
  db.query(DELETE_SQL).run(id);
}

async function update(id: number, updates: UpdateCoffee): Promise<Coffee | undefined> {
  const existing = await find(id);
  if (!existing) {
    return undefined;
  }

  db.query(UPDATE_SQL).run(
    updates.roaster ?? existing.roaster,
    updates.name ?? existing.name,
    updates.roastDate !== undefined
      ? updates.roastDate
        ? updates.roastDate.toISOString()
        : null
      : existing.roastDate
        ? existing.roastDate.toISOString()
        : null,
    updates.process !== undefined ? updates.process : existing.process,
    updates.notes !== undefined ? updates.notes : existing.notes,
    updates.archived !== undefined ? (updates.archived ? 1 : 0) : existing.archived ? 1 : 0,
    id,
  );

  return await find(id);
}

async function find(id: number): Promise<Coffee | undefined> {
  const row = db.query(FIND_BY_ID_SQL).get(id) as CoffeeDatabaseRow | undefined;
  return row ? mapDatabaseRowToSchema(row) : undefined;
}

export default { listAll, save, destroy, find, update };
