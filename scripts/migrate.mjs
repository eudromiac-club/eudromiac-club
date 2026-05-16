// Aplica las migrations pendientes contra la DB en DATABASE_URL.
// Corre con: npm run db:migrate
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations OK');
  await pool.end();
} catch (e) {
  console.error('Migration FAIL:', e.message);
  await pool.end();
  process.exit(1);
}
