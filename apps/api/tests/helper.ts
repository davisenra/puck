import { loadMigrations, runMigrations } from '../scripts/migrations';
import { useTestDatabase } from '../src/database';

export async function setupTestDatabase(): Promise<void> {
  useTestDatabase();

  const { db } = await import('../src/database');
  await runMigrations(db, await loadMigrations());
}

export function teardownTestDatabase(): void {}
