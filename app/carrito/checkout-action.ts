'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { orders, orderItems, carts, cartItems } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { getCartSnapshot } from '@/lib/cart/server';
import { getMonthlyCap, getMonthlyConsumption } from '@/lib/users/consumption';
import { mpConfigured, mpPreference } from '@/lib/mp/client';
import { getAppliedCoupon, clearAppliedCoupon, calcDiscount } from '@/lib/coupons';
import { generateUniqueOrderNumber } from '@/lib/orders/number';
import { parseShippingForm, type ShippingFieldErrors } from '@/lib/orders/shipping';

// Estado del form de envío. `message` = error general (cuenta no habilitada,
// carrito vacío, cap mensual). `errors` = errores por campo de la dirección.
// En el camino feliz la acción redirige (a MP, success o pending), así que
// nunca devuelve estado.
export type CheckoutState = { message?: string; errors?: ShippingFieldErrors } | undefined;

export async function startCheckoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await requireUser();
  if (user.status !== 'active' && user.role !== 'admin') {
    return { message: 'Tu cuenta no está habilitada para comprar.' };
  }

  const cart = await getCartSnapshot(user.id);
  if (cart.items.length === 0) {
    return { message: 'Tu carrito está vacío.' };
  }

  if (user.role !== 'admin') {
    const monthlyCap = await getMonthlyCap(user.id);
    if (monthlyCap != null) {
      const consumed = (await getMonthlyConsumption(user.id)).grams;
      if (consumed + cart.totalGrams > monthlyCap) {
        return {
          message: `Este pedido supera tu cap mensual de ${monthlyCap}g (consumido ${consumed}g + carrito ${cart.totalGrams}g).`,
        };
      }
    }
  }

  const shipping = parseShippingForm(formData);
  if (!shipping.ok) {
    return { errors: shipping.errors };
  }

  const coupon = await getAppliedCoupon();
  const subtotalCents = cart.totalCents;
  const discountCents = calcDiscount(subtotalCents, coupon);
  const totalCents = subtotalCents - discountCents;
  const orderNumber = await generateUniqueOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: user.id,
      status: totalCents === 0 ? 'paid' : 'pending',
      subtotalCents,
      discountCents,
      couponCode: coupon?.code ?? null,
      totalCents,
      shippingAddress: shipping.value,
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

  // Total = 0 (cupón 100%) → orden paid directa, vaciar carrito y cupón
  if (totalCents === 0) {
    const [cartRow] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, user.id))
      .limit(1);
    if (cartRow) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartRow.id));
    }
    await clearAppliedCoupon();
    revalidatePath('/carrito');
    revalidatePath('/cuenta/pedidos');
    revalidatePath('/admin', 'layout');
    revalidatePath('/', 'layout');
    redirect(`/checkout/success?orderId=${order.id}`);
  }

  if (!mpConfigured()) {
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
