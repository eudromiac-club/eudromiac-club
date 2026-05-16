// Crea (o promueve) el usuario admin del club.
// Uso: npm run db:seed-admin -- <password> [email]
// Si no se pasa email, usa ADMIN_EMAIL del entorno.
import bcrypt from 'bcryptjs';
import pg from 'pg';

const args = process.argv.slice(2);
const password = args[0];
const email = (args[1] ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();

if (!password) {
  console.error('Falta password. Uso: npm run db:seed-admin -- <password> [email]');
  process.exit(1);
}
if (!email) {
  console.error('Falta email (no hay ADMIN_EMAIL en env y no se pasó como arg).');
  process.exit(1);
}
if (password.length < 8) {
  console.error('La password debe tener al menos 8 caracteres.');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, role, status, email_verified)
     VALUES ($1, $2, 'admin', 'active', now())
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = 'admin',
           status = 'active',
           email_verified = COALESCE(users.email_verified, now()),
           updated_at = now()
     RETURNING id, email, role, status`,
    [email, hash],
  );
  console.log('OK:', result.rows[0]);
  await pool.end();
} catch (e) {
  console.error('FAIL:', e.message);
  await pool.end();
  process.exit(1);
}
