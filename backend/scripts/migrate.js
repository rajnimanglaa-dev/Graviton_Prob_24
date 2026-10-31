import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, checkDatabaseConnection } from '../config/db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, '..', 'sql', 'schema.sql');

try {
  await checkDatabaseConnection();
  const sql = await fs.readFile(schemaPath, 'utf8');
  const statements = sql.split(/;\s*(?:\r?\n|$)/).map((item) => item.trim()).filter(Boolean);
  for (const statement of statements) await pool.query(statement);
  console.log('Database schema migrated successfully.');
  process.exitCode = 0;
} catch (error) {
  console.error('Database migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
