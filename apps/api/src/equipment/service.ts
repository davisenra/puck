import { CreateEquipment, Equipment, EquipmentList } from './schema';
import { db } from '../database';

type EquipmentDatabaseRow = Record<string, any>;

const SELECT_ALL_SQL = 'SELECT e.* FROM equipment e ORDER BY e.id DESC';

const INSERT_SQL =
  'INSERT INTO equipment (name, type, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

const DELETE_SQL = 'DELETE FROM equipment WHERE id = ?';

const FIND_BY_ID_SQL = 'SELECT * FROM equipment WHERE id = ?';

function mapDatabaseRowToSchema(e: EquipmentDatabaseRow): Equipment {
  return {
    id: e.id,
    name: e.name,
    type: e.type,
    createdAt: new Date(e.created_at),
    updatedAt: new Date(e.updated_at),
  };
}

async function listAll(): Promise<EquipmentList> {
  const equipment = db.query(SELECT_ALL_SQL).all() as EquipmentDatabaseRow[];
  return equipment.map(mapDatabaseRowToSchema);
}

async function save(eq: CreateEquipment): Promise<Equipment> {
  const result = db.query(INSERT_SQL).run(eq.name, eq.type);
  const id = result.lastInsertRowid;
  const row = db.query('SELECT * FROM equipment WHERE id = ?').get(id) as EquipmentDatabaseRow;
  return mapDatabaseRowToSchema(row);
}

async function destroy(id: number): Promise<void> {
  db.query(DELETE_SQL).run(id);
}

async function find(id: number): Promise<Equipment | undefined> {
  const row = db.query(FIND_BY_ID_SQL).get(id) as EquipmentDatabaseRow | undefined;
  return row ? mapDatabaseRowToSchema(row) : undefined;
}

export default { listAll, save, destroy, find };
