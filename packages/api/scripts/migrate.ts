import { db } from '../src/database';
import { loadMigrations, runMigrations } from './migrations';

await runMigrations(db, await loadMigrations());
