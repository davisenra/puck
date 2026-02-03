import { db } from '../database';
import { CreateEquipment, Equipment, EquipmentList, UpdateEquipment } from './schema';

type EquipmentDatabaseRow = Record<string, any>;

const SELECT_ALL_SQL = 'SELECT e.* FROM equipment e';
const ORDER_BY_SQL = ' ORDER BY e.id DESC';

const INSERT_SQL =
  'INSERT INTO equipment (name, type, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

const DELETE_SQL = 'DELETE FROM equipment WHERE id = ?';

const UPDATE_SQL = 'UPDATE equipment SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

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

async function listAll(type?: string): Promise<EquipmentList> {
  let sql = SELECT_ALL_SQL;
  const params: any[] = [];

  if (type) {
    sql += ' WHERE e.type = ?';
    params.push(type);
  }

  sql += ORDER_BY_SQL;

  const equipment = db.query(sql).all(...params) as EquipmentDatabaseRow[];
  return equipment.map(mapDatabaseRowToSchema);
}

async function save(eq: CreateEquipment): Promise<Equipment> {
  const result = db.query(INSERT_SQL).run(eq.name, eq.type);
  const id = result.lastInsertRowid;
  const row = db.query(FIND_BY_ID_SQL).get(id) as EquipmentDatabaseRow;
  return mapDatabaseRowToSchema(row);
}

async function destroy(id: number): Promise<void> {
  db.query(DELETE_SQL).run(id);
}

async function find(id: number): Promise<Equipment | undefined> {
  const row = db.query(FIND_BY_ID_SQL).get(id) as EquipmentDatabaseRow | undefined;
  return row ? mapDatabaseRowToSchema(row) : undefined;
}

async function update(id: number, data: UpdateEquipment): Promise<Equipment | undefined> {
  db.query(UPDATE_SQL).run(data.name, id);
  return await find(id);
}

export default { listAll, save, destroy, find, update };
