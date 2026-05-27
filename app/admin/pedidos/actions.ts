'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { orders, users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { isCarrierKey } from '@/lib/orders/carriers';
import { notifyOrderShipped } from '@/lib/email/notify';

const NEXT_STATUS = z.enum(['paid', 'shipped', 'delivered', 'cancelled', 'refunded']);

const UpdateSchema = z.object({
  orderId: z.string().uuid(),
  status: NEXT_STATUS,
});

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = UpdateSchema.safeParse({
    orderId: formData.get('orderId'),
    status: formData.get('status'),
  });
  if (!parsed.success) return;

  await db
    .update(orders)
    .set({ status: parsed.data.status, updatedAt: sql`now()` })
    .where(eq(orders.id, parsed.data.orderId));

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin/pedidos/' + parsed.data.orderId);
  revalidatePath('/cuenta/pedidos');
}

// Despacho: además de pasar a "shipped" guarda transportista + número de
// seguimiento. Acción aparte porque tiene validación con feedback (el resto
// de las transiciones son botones simples).
export type DispatchState = { error?: string } | undefined;

export async function dispatchOrderAction(
  _prev: DispatchState,
  formData: FormData,
): Promise<DispatchState> {
  await requireAdmin();

  const orderId = String(formData.get('orderId') ?? '');
  const carrier = String(formData.get('carrier') ?? '');
  const trackingNumber = String(formData.get('trackingNumber') ?? '').trim();

  if (!z.string().uuid().safeParse(orderId).success) return { error: 'Pedido inválido.' };
  if (!isCarrierKey(carrier)) return { error: 'Elegí un transportista.' };
  if (carrier !== 'propio' && !trackingNumber) {
    return { error: 'Ingresá el número de seguimiento.' };
  }

  const [o] = await db
    .select({ status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!o || o.status !== 'paid') {
    return { error: 'Solo se pueden despachar pedidos pagados.' };
  }

  await db
    .update(orders)
    .set({
      status: 'shipped',
      trackingCarrier: carrier,
      trackingNumber: trackingNumber || null,
      updatedAt: sql`now()`,
    })
    .where(eq(orders.id, orderId));

  // Email de "pedido despachado" con el link de tracking (best-effort).
  const [info] = await db
    .select({ orderNumber: orders.orderNumber, email: users.email, name: users.name })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(eq(orders.id, orderId))
    .limit(1);
  if (info?.email) {
    await notifyOrderShipped({
      to: info.email,
      name: info.name,
      orderNumber: info.orderNumber,
      carrier,
      trackingNumber: trackingNumber || null,
    });
  }

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin/pedidos/' + orderId);
  revalidatePath('/cuenta/pedidos');
  return undefined;
}
