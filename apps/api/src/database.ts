import { Database } from 'bun:sqlite';

let db = new Database(process.env.DATABASE_PATH ?? ':memory:');

export function useTestDatabase(): void {
  db.close();
  db = new Database(':memory:');
}

export { db };
