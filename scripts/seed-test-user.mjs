// Crea (o resetea) un usuario de prueba.
// Uso: npm run db:seed-test-user -- <email> <password> [status] [role]
//   status: pending_kyc | under_review | active | rejected (default: active)
//   role:   member | admin (default: member)
import bcrypt from 'bcryptjs';
import pg from 'pg';

const args = process.argv.slice(2);
const email = (args[0] ?? '').trim().toLowerCase();
const password = args[1] ?? '';
const status = (args[2] ?? 'active').trim();
const role = (args[3] ?? 'member').trim();

if (!email || !password) {
  console.error('Uso: npm run db:seed-test-user -- <email> <password> [status] [role]');
  process.exit(1);
}

const ALLOWED_STATUS = ['pending_kyc', 'under_review', 'active', 'rejected', 'suspended', 'inactive'];
const ALLOWED_ROLE = ['member', 'admin'];
if (!ALLOWED_STATUS.includes(status)) {
  console.error(`status inválido: ${status}. Permitidos: ${ALLOWED_STATUS.join(', ')}`);
  process.exit(1);
}
if (!ALLOWED_ROLE.includes(role)) {
  console.error(`role inválido: ${role}. Permitidos: ${ALLOWED_ROLE.join(', ')}`);
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, role, status, email_verified, name)
     VALUES ($1, $2, $3, $4, now(), 'Test User')
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           status = EXCLUDED.status,
           updated_at = now()
     RETURNING id, email, role, status`,
    [email, hash, role, status],
  );
  console.log('OK:', result.rows[0]);
  await pool.end();
} catch (e) {
  console.error('FAIL:', e.message);
  await pool.end();
  process.exit(1);
}
