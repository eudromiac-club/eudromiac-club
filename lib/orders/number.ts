import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

// Pulls the next value from the postgres sequence `order_number_seq` and
// formats it as EUC-00001, EUC-00002, ... The sequence guarantees uniqueness
// and monotonic increase even under concurrent inserts.
//
// Si la sequence no existe (DB nueva sin correr db:setup-order-seq), la
// creamos sobre la marcha — operación idempotente.
export async function generateUniqueOrderNumber(): Promise<string> {
  await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1`);
  const result = await db.execute(
    sql`SELECT nextval('order_number_seq')::bigint AS next`,
  );
  const rows = (result as unknown as { rows?: Array<{ next: string | number | bigint }> }).rows
    ?? (result as unknown as Array<{ next: string | number | bigint }>);
  const raw = rows?.[0]?.next;
  const n = typeof raw === 'bigint' ? Number(raw) : Number(raw ?? 0);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error('No se pudo generar el número de pedido.');
  }
  return `EUC-${n.toString().padStart(5, '0')}`;
}
