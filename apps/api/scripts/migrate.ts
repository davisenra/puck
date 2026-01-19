import { db } from '../src/database';
import { loadMigrations, runMigrations } from '../src/migrations';

await runMigrations(db, await loadMigrations());
