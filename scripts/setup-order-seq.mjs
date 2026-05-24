// Crea (si no existe) la sequence order_number_seq que alimenta el formato
// EUC-00001, EUC-00002... de los números de pedido.
// Idempotente. Correr una vez con: npm run db:setup-order-seq
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query('CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1');
  const { rows } = await pool.query(
    "SELECT last_value, is_called FROM order_number_seq",
  );
  console.log(`order_number_seq OK (last_value=${rows[0].last_value}, called=${rows[0].is_called}).`);
  console.log('El próximo pedido será EUC-' + String(Number(rows[0].last_value) + (rows[0].is_called ? 1 : 0)).padStart(5, '0'));
} catch (e) {
  console.error('FAIL:', e.message);
  process.exit(1);
} finally {
  await pool.end();
}
