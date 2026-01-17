import { Database } from 'bun:sqlite';

const db = new Database(process.env.DATABASE_PATH ?? ':memory:');

export { db };
