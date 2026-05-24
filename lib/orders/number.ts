import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

// Caracteres legibles: sin 0/O ni 1/I.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(len: number): string {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

// Genera un número de pedido único formato EU-XXXXXX. Reintenta si colisiona
// (probabilidad mínima con 32^6 = 1B combinaciones).
export async function generateUniqueOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `EU-${randomCode(6)}`;
    const [existing] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.orderNumber, candidate))
      .limit(1);
    if (!existing) return candidate;
  }
  throw new Error('No se pudo generar un número de pedido único.');
}
