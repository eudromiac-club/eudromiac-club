import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { orders, orderItems, genetics, cartItems, carts, users } from '@/lib/db/schema';
import { mpConfigured, mpPayment } from '@/lib/mp/client';
import { notifyOrderConfirmed, notifyTeamNewOrder } from '@/lib/email/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// MP envía webhooks con header x-signature como:
//   ts=<timestamp>,v1=<sha256_hex>
// donde sha256_hex es HMAC-SHA256 sobre el template:
//   id:<data.id>;request-id:<x-request-id>;ts:<ts>;
// firmado con el secret del webhook configurado.
// https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
function verifySignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[mp/webhook] MP_WEBHOOK_SECRET no configurado, skipping signature check.');
    return true; // permitir en dev; en prod recomendado setear el secret
  }
  const signature = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id');
  if (!signature || !requestId) return false;

  const parts = Object.fromEntries(
    signature.split(',').map((p) => {
      const [k, v] = p.split('=').map((s) => s.trim());
      return [k, v];
    }),
  );
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const computed = crypto.createHmac('sha256', secret).update(template).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1));
  } catch {
    return false;
  }
}

type MpPayment = {
  id?: number | string;
  status?: 'pending' | 'approved' | 'authorized' | 'in_process' | 'rejected' | 'refunded' | 'cancelled' | 'in_mediation' | 'charged_back';
  status_detail?: string;
  transaction_amount?: number;
  external_reference?: string;
  metadata?: Record<string, unknown>;
  date_approved?: string | null;
};

export async function POST(req: NextRequest) {
  if (!mpConfigured()) {
    return NextResponse.json({ ok: false, error: 'mp_not_configured' }, { status: 503 });
  }

  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const type = body.type ?? body.action ?? '';
  const dataId = body?.data?.id ? String(body.data.id) : '';

  // Solo procesamos notificaciones de payment.
  if (!type.includes('payment') || !dataId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!verifySignature(req, dataId)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  // Traer el payment desde MP para confirmar status y monto.
  let payment: MpPayment;
  try {
    const result = (await mpPayment().get({ id: dataId })) as unknown as MpPayment;
    payment = result;
  } catch (e) {
    console.error('[mp/webhook] no pudimos traer el payment:', e);
    return NextResponse.json({ ok: false, error: 'mp_fetch_failed' }, { status: 502 });
  }

  const orderId = (payment.metadata as { orderId?: string } | undefined)?.orderId ?? payment.external_reference;
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'no_order_id' }, { status: 400 });
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) {
    return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
  }

  // Si ya está pagado, idempotente.
  if (order.status === 'paid') {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  // Validar monto server-side: lo que dice MP vs lo que dice nuestra DB.
  const mpAmount = Math.round((payment.transaction_amount ?? 0) * 100);
  if (mpAmount > 0 && mpAmount !== order.totalCents) {
    console.error('[mp/webhook] monto mismatch:', { orderId, mpAmount, dbCents: order.totalCents });
    return NextResponse.json({ ok: false, error: 'amount_mismatch' }, { status: 409 });
  }

  if (payment.status === 'approved') {
    let didPay = false;
    try {
      await db.transaction(async (tx) => {
        // Re-leer order con FOR UPDATE para evitar race.
        const [fresh] = await tx
          .select({ status: orders.status })
          .from(orders)
          .where(eq(orders.id, orderId))
          .for('update')
          .limit(1);
        if (!fresh || fresh.status !== 'pending') return;

        await tx
          .update(orders)
          .set({
            status: 'paid',
            mpPaymentId: String(payment.id ?? ''),
            updatedAt: sql`now()`,
          })
          .where(eq(orders.id, orderId));

        // Decrementar stock por cada line item.
        const items = await tx
          .select({ geneticId: orderItems.geneticId, qty: orderItems.quantity })
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));

        for (const it of items) {
          await tx
            .update(genetics)
            .set({ stock: sql`greatest(${genetics.stock} - ${it.qty}, 0)`, updatedAt: sql`now()` })
            .where(eq(genetics.id, it.geneticId));
        }

        // Vaciar el carrito del usuario que pagó.
        const [userCart] = await tx
          .select({ id: carts.id })
          .from(carts)
          .where(eq(carts.userId, order.userId))
          .limit(1);
        if (userCart) {
          await tx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
        }

        didPay = true;
      });
    } catch (e) {
      console.error('[mp/webhook] error procesando pago aprobado:', e);
      return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
    }

    // Emails post-pago (best-effort, fuera de la transacción). Solo si este
    // webhook fue el que transicionó el pedido a pagado.
    if (didPay) {
      try {
        const [u] = await db
          .select({ email: users.email, name: users.name })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);
        const lines = await db
          .select({
            name: orderItems.nameSnapshot,
            quantity: orderItems.quantity,
            unitPriceCents: orderItems.unitPriceCents,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));
        if (u?.email) {
          await notifyOrderConfirmed({
            to: u.email,
            name: u.name,
            orderNumber: order.orderNumber,
            totalCents: order.totalCents,
            items: lines,
            shipping: order.shippingAddress,
            isFree: false,
          });
        }
        await notifyTeamNewOrder({
          orderNumber: order.orderNumber,
          memberName: u?.name ?? null,
          totalCents: order.totalCents,
        });
      } catch (e) {
        console.error('[mp/webhook] email post-pago falló:', e);
      }
    }
  } else if (
    payment.status === 'rejected' ||
    payment.status === 'cancelled' ||
    payment.status === 'refunded' ||
    payment.status === 'charged_back'
  ) {
    await db
      .update(orders)
      .set({
        status: payment.status === 'refunded' ? 'refunded' : 'cancelled',
        mpPaymentId: String(payment.id ?? ''),
        updatedAt: sql`now()`,
      })
      .where(eq(orders.id, orderId));
  }

  return NextResponse.json({ ok: true });
}
