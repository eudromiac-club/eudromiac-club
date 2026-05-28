import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

// ─────────────────────────────────────────────────────────────────────────────
// REGLAS POR DEFECTO (ajustables por el club).
//
// Puntos: 1 punto por cada $PESOS_PER_POINT gastados en pedidos efectivamente
// pagados (paid/shipped/delivered). Se derivan de los pedidos en tiempo real, no
// se guardan en DB → siempre exactos, sin riesgo de desincronización.
//
// Niveles: por puntos acumulados. Por ahora son SOLO estatus (no dan descuento
// todavía); sumar beneficios es un paso aparte cuando el club lo defina.
// ─────────────────────────────────────────────────────────────────────────────
export const PESOS_PER_POINT = 100;

// Estados que cuentan como "gastado".
const PAID_STATUSES = ['paid', 'shipped', 'delivered'] as const;

export type TierKey = 'bronce' | 'plata' | 'oro' | 'platino';

export const TIERS: { key: TierKey; label: string; min: number }[] = [
  { key: 'bronce', label: 'Bronce', min: 0 },
  { key: 'plata', label: 'Plata', min: 1000 },
  { key: 'oro', label: 'Oro', min: 2500 },
  { key: 'platino', label: 'Platino', min: 5000 },
];

export type Loyalty = {
  points: number;
  spentCents: number;
  tier: { key: TierKey; label: string; min: number };
  next: { label: string; min: number; pointsToGo: number; progressPct: number } | null;
};

export function pointsFromCents(cents: number): number {
  return Math.floor(cents / 100 / PESOS_PER_POINT);
}

export async function getLoyalty(userId: string): Promise<Loyalty> {
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${orders.totalCents}), 0)` })
    .from(orders)
    .where(and(eq(orders.userId, userId), inArray(orders.status, [...PAID_STATUSES])));

  const spentCents = Number(row?.total ?? 0);
  const points = pointsFromCents(spentCents);

  // Nivel actual = el más alto cuyo umbral ya alcanzó.
  let tierIdx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (points >= TIERS[i].min) tierIdx = i;
  }
  const tier = TIERS[tierIdx];
  const nextTier = TIERS[tierIdx + 1] ?? null;

  let next: Loyalty['next'] = null;
  if (nextTier) {
    const band = nextTier.min - tier.min;
    const into = points - tier.min;
    next = {
      label: nextTier.label,
      min: nextTier.min,
      pointsToGo: Math.max(nextTier.min - points, 0),
      progressPct: band > 0 ? Math.min(100, Math.round((into / band) * 100)) : 0,
    };
  }

  return { points, spentCents, tier, next };
}

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
