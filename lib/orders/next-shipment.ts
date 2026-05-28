import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

export type NextShipment = {
  id: string;
  orderNumber: string | null;
  status: 'paid' | 'shipped';
  trackingCarrier: string | null;
  trackingNumber: string | null;
} | null;

// El pedido "en curso" más reciente: pagado (preparando) o enviado (en camino).
// Los entregados/cancelados no cuentan como "próximo envío".
export async function getNextShipment(userId: string): Promise<NextShipment> {
  const [row] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      trackingCarrier: orders.trackingCarrier,
      trackingNumber: orders.trackingNumber,
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), inArray(orders.status, ['paid', 'shipped'])))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status as 'paid' | 'shipped',
    trackingCarrier: row.trackingCarrier,
    trackingNumber: row.trackingNumber,
  };
}
