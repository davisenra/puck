import Database from 'bun:sqlite';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

type Migration = {
  name: string;
  sql: string;
};

export async function loadMigrations(): Promise<Migration[]> {
  const migrationsDir = join(import.meta.dir, '..', 'migrations');

  try {
    const files = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'));

    const migrations = await Promise.all(
      files.sort().map(async (filename) => {
        const filePath = join(migrationsDir, filename);
        const content = await Bun.file(filePath).text();

        return {
          name: filename,
          sql: content,
        };
      }),
    );

    return migrations;
  } catch (error) {
    console.error('Failed to load migrations:', error);
    process.exit(1);
  }
}

export async function runMigrations(db: Database, migrations: Migration[]) {
  console.log('Running database migrations...');

  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const appliedMigrations = db.query('SELECT name FROM migrations').all() as Array<{
      name: string;
    }>;
    const appliedVersions = new Set(appliedMigrations.map((m) => m.name));

    for (const migration of migrations) {
      if (!appliedVersions.has(migration.name)) {
        console.log(`Applying migration: ${migration.name}`);
        db.run(migration.sql);
        db.query('INSERT INTO migrations (name) VALUES (?)').run(migration.name);
      }
    }

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
