import { db } from '../src/database';
import { runMigrations, loadMigrations } from '../src/migrations';

await runMigrations(db, await loadMigrations());
