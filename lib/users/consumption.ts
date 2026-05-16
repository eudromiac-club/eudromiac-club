import 'server-only';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, orderItems, patientProfiles, carts, cartItems } from '@/lib/db/schema';

const COUNTING_STATUSES = ['paid', 'shipped', 'delivered'] as const satisfies readonly (
  | 'paid'
  | 'shipped'
  | 'delivered'
)[];

export type MonthlyConsumption = {
  grams: number;
  monthLabel: string; // "Marzo 2026"
  monthStart: Date;
};

function startOfMonth(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

function formatMonth(d: Date): string {
  return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(d);
}

// Suma de gramos consumidos por el usuario desde el día 1 del mes en curso
// (UTC). Solo cuenta orders con status paid/shipped/delivered: pending no
// confirmaron pago, cancelled/refunded no consumen cap.
export async function getMonthlyConsumption(userId: string): Promise<MonthlyConsumption> {
  const monthStart = startOfMonth();

  const [row] = await db
    .select({ grams: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int` })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.userId, userId),
        gte(orders.createdAt, monthStart),
        inArray(orders.status, COUNTING_STATUSES),
      ),
    );

  return {
    grams: row?.grams ?? 0,
    monthLabel: formatMonth(monthStart),
    monthStart,
  };
}

// Devuelve el cap mensual del user (de patient_profiles) o null si no tiene.
export async function getMonthlyCap(userId: string): Promise<number | null> {
  const [row] = await db
    .select({ cap: patientProfiles.monthlyGramsLimit })
    .from(patientProfiles)
    .where(eq(patientProfiles.userId, userId))
    .limit(1);
  if (!row?.cap) return null;
  const n = Number(row.cap);
  return Number.isFinite(n) ? n : null;
}

// Suma de gramos en el carrito actual del user. Útil para validar que
// (consumido_mes + carrito) ≤ cap antes de un add o checkout.
export async function getCartGramsTotal(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${cartItems.quantity}), 0)::int` })
    .from(carts)
    .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
    .where(eq(carts.userId, userId));
  return row?.total ?? 0;
}
