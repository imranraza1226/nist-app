import { getDatabase } from './database';
import { Control, Bookmark, Framework } from '../types';

function parseControl(row: Record<string, unknown>): Control {
  return {
    id: row.id as number,
    control_id: row.control_id as string,
    title: row.title as string,
    description: row.description as string,
    implementation_guidance: row.implementation_guidance as string,
    framework: row.framework as Framework,
    function_category: row.function_category as string,
    family: row.family as string,
    related_controls: JSON.parse((row.related_controls as string) || '[]'),
    tags: JSON.parse((row.tags as string) || '[]'),
  };
}

// ── Controls ──────────────────────────────────────────────────

export async function getAllControls(): Promise<Control[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM controls ORDER BY framework, function_category, control_id'
  );
  return rows.map(parseControl);
}

export async function getControlById(controlId: string): Promise<Control | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM controls WHERE control_id = ?',
    [controlId]
  );
  return row ? parseControl(row) : null;
}

export async function getControlsByFramework(framework: Framework): Promise<Control[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM controls WHERE framework = ? ORDER BY function_category, control_id',
    [framework]
  );
  return rows.map(parseControl);
}

export async function searchControls(
  searchQuery: string,
  framework?: Framework,
  family?: string
): Promise<Control[]> {
  const db = await getDatabase();
  const conditions: string[] = [];
  const params: (string | number | null)[] = [];

  if (searchQuery.trim()) {
    const term = `%${searchQuery.trim()}%`;
    conditions.push('(title LIKE ? OR description LIKE ? OR control_id LIKE ? OR tags LIKE ? OR family LIKE ?)');
    params.push(term, term, term, term, term);
  }

  if (framework) {
    conditions.push('framework = ?');
    params.push(framework);
  }

  if (family) {
    conditions.push('family = ?');
    params.push(family);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM controls ${where} ORDER BY framework, function_category, control_id LIMIT 200`;

  const rows = await db.getAllAsync<Record<string, unknown>>(sql, params);
  return rows.map(parseControl);
}

export async function getFamiliesByFramework(framework: Framework): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ family: string }>(
    'SELECT DISTINCT family FROM controls WHERE framework = ? ORDER BY family',
    [framework]
  );
  return rows.map((r) => r.family);
}

export async function getFunctionsByFramework(framework: Framework): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ function_category: string }>(
    'SELECT DISTINCT function_category FROM controls WHERE framework = ? ORDER BY function_category',
    [framework]
  );
  return rows.map((r) => r.function_category);
}

// ── Bookmarks ────────────────────────────────────────────────

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(`
    SELECT b.id, b.control_id, b.note, b.created_at,
           c.title, c.description, c.framework, c.function_category, c.family,
           c.implementation_guidance, c.related_controls, c.tags
    FROM bookmarks b
    LEFT JOIN controls c ON b.control_id = c.control_id
    ORDER BY b.created_at DESC
  `);

  return rows.map((row) => ({
    id: row.id as number,
    control_id: row.control_id as string,
    note: row.note as string,
    created_at: row.created_at as string,
    control: row.title ? parseControl(row) : undefined,
  }));
}

export async function isBookmarked(controlId: string): Promise<boolean> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM bookmarks WHERE control_id = ?',
    [controlId]
  );
  return (row?.count ?? 0) > 0;
}

export async function addBookmark(controlId: string, note = ''): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR IGNORE INTO bookmarks (control_id, note) VALUES (?, ?)',
    [controlId, note]
  );
}

export async function removeBookmark(controlId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM bookmarks WHERE control_id = ?', [controlId]);
}

export async function updateBookmarkNote(controlId: string, note: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE bookmarks SET note = ? WHERE control_id = ?',
    [note, controlId]
  );
}

export async function getBookmarkCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM bookmarks');
  return row?.count ?? 0;
}
