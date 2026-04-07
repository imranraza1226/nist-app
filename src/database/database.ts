import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { NIST_CONTROLS } from '../data/nistData';

let db: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!db) {
    db = await openDatabaseAsync('nist_compass.db');
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS controls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      control_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      implementation_guidance TEXT NOT NULL,
      framework TEXT NOT NULL,
      function_category TEXT NOT NULL,
      family TEXT NOT NULL,
      related_controls TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      control_id TEXT NOT NULL UNIQUE,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_controls_framework ON controls(framework);
    CREATE INDEX IF NOT EXISTS idx_controls_function ON controls(function_category);
    CREATE INDEX IF NOT EXISTS idx_controls_family ON controls(family);
    CREATE INDEX IF NOT EXISTS idx_controls_control_id ON controls(control_id);
  `);

  await seedDatabase(database);
}

async function seedDatabase(database: SQLiteDatabase): Promise<void> {
  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM controls WHERE framework = ?',
    [NIST_CONTROLS[0]?.framework ?? '']
  );

  if (existing && existing.count > 0) return;

  await database.withTransactionAsync(async () => {
    for (const control of NIST_CONTROLS) {
      await database.runAsync(
        `INSERT OR IGNORE INTO controls
          (control_id, title, description, implementation_guidance, framework, function_category, family, related_controls, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          control.control_id,
          control.title,
          control.description,
          control.implementation_guidance,
          control.framework,
          control.function_category,
          control.family,
          JSON.stringify(control.related_controls),
          JSON.stringify(control.tags),
        ]
      );
    }
  });
}
