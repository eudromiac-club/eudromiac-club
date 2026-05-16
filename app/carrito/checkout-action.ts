'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { getCartSnapshot } from '@/lib/cart/server';
import { mpConfigured, mpPreference } from '@/lib/mp/client';

export async function startCheckoutAction(): Promise<void> {
  const user = await requireUser();
  if (user.status !== 'active' && user.role !== 'admin') {
    throw new Error('Tu cuenta no está habilitada para comprar.');
  }

  const cart = await getCartSnapshot(user.id);
  if (cart.items.length === 0) {
    throw new Error('Tu carrito está vacío.');
  }

  // Crear order en DB con snapshot de precios actuales (status pending).
  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      status: 'pending',
      totalCents: cart.totalCents,
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    cart.items.map((item) => ({
      orderId: order.id,
      geneticId: item.geneticId,
      nameSnapshot: item.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
  );

  if (!mpConfigured()) {
    // Sin MP configurado todavía: dejamos el order creado, redirect a una
    // página explicativa. El admin puede ver el pedido en /admin/pedidos.
    redirect(`/checkout/pending?orderId=${order.id}&reason=mp_not_configured`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') ?? '';
  const preference = mpPreference();

  let initPoint: string;
  try {
    const result = await preference.create({
      body: {
        external_reference: order.id,
        statement_descriptor: 'EUDROMIA',
        items: cart.items.map((item) => ({
          id: item.geneticId,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.unitPriceCents / 100,
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${baseUrl}/checkout/success?orderId=${order.id}`,
          failure: `${baseUrl}/checkout/failure?orderId=${order.id}`,
          pending: `${baseUrl}/checkout/pending?orderId=${order.id}`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhooks/mp`,
        metadata: {
          orderId: order.id,
          userId: user.id,
        },
      },
    });
    if (!result.id || !result.init_point) {
      throw new Error('MP no devolvió preference id / init_point.');
    }
    initPoint = result.init_point;

    await db
      .update(orders)
      .set({ mpPreferenceId: result.id, updatedAt: sql`now()` })
      .where(sql`${orders.id} = ${order.id}`);
  } catch (e) {
    console.error('[checkout] error creando preference MP:', e);
    redirect(`/checkout/failure?orderId=${order.id}&reason=mp_error`);
  }

  revalidatePath('/carrito');
  revalidatePath('/cuenta/pedidos');
  redirect(initPoint);
}
