import { useTestDatabase } from '../src/database';
import { loadMigrations, runMigrations } from '../src/migrations';

export async function setupTestDatabase(): Promise<void> {
  useTestDatabase();

  const { db } = await import('../src/database');
  await runMigrations(db, await loadMigrations());
}

export function teardownTestDatabase(): void {}
