// Sanity check de la conexión a la DB. Corre con: node --env-file=.env.local scripts/db-check.mjs
import pg from 'pg';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const v = await client.query('SELECT version()');
  console.log('OK:', v.rows[0].version);
  const t = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
  console.log('tables in public:', t.rows.length === 0 ? '(none)' : t.rows.map((r) => r.tablename).join(', '));
  await client.end();
} catch (e) {
  console.error('FAIL:', e.message);
  process.exit(1);
}
