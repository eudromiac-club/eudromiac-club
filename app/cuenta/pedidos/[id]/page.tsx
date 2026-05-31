import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  PAYMENT_METHOD_LABEL,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';
import { carrierLabel, trackingUrl } from '@/lib/orders/carriers';
import { DELIVERY_WINDOW_LABEL } from '@/lib/orders/shipping';

export const metadata = {
  title: 'Mi pedido · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function MiPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const [row] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
    .limit(1);
  if (!row) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-10">
        <Link
          href="/cuenta/pedidos"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Mis pedidos
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-2xl font-medium uppercase tracking-[0.1em] sm:text-3xl">
            Pedido <span className="text-brand">{row.orderNumber ?? `#${row.id.slice(0, 8)}`}</span>
          </h1>
          <span
            className={`inline-flex rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.25em] ${
              ORDER_STATUS_COLOR[row.status] ?? 'border-border text-muted-foreground'
            }`}
          >
            {ORDER_STATUS_LABEL[row.status] ?? row.status}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{formatDate(row.createdAt)}</p>
      </header>

      <section className="border border-border bg-card">
        <h2 className="border-b border-border p-5 font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Detalle
        </h2>
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it.id} className="flex flex-wrap items-center gap-4 p-5 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-display uppercase tracking-[0.12em]">{it.nameSnapshot}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {it.quantity}g × {formatPriceArs(it.unitPriceCents)}
              </p>
              <p className="font-mono text-sm text-brand">
                {formatPriceArs(it.unitPriceCents * it.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-border p-5">
          {row.discountCents > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-mono">{formatPriceArs(row.subtotalCents)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-brand">
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Descuento {row.couponCode ? `(${row.couponCode})` : ''}
                </span>
                <span className="font-mono">− {formatPriceArs(row.discountCents)}</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Total
            </span>
            <span className="font-display text-2xl tabular-nums text-brand">
              {formatPriceArs(row.totalCents)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Forma de pago
            </span>
            <span className="text-sm">
              {PAYMENT_METHOD_LABEL[row.paymentMethod] ?? row.paymentMethod}
            </span>
          </div>
          {row.paymentMethod === 'cash_on_delivery' && row.status === 'pending' && (
            <p className="text-xs text-muted-foreground">
              Pagás en efectivo al recibir el pedido.
            </p>
          )}
        </div>
      </section>

      {row.shippingAddress && (
        <section className="mt-8 border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Envío
          </h2>
          <div className="mt-4 space-y-1 text-sm">
            <p className="font-display uppercase tracking-[0.1em]">
              {row.shippingAddress.recipientName}
            </p>
            <p className="text-muted-foreground">
              {row.shippingAddress.street}, {row.shippingAddress.city},{' '}
              {row.shippingAddress.province}
              {row.shippingAddress.postalCode ? ` (CP ${row.shippingAddress.postalCode})` : ''}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Tel: {row.shippingAddress.phone}
            </p>
            {row.shippingAddress.deliveryWindow && (
              <p className="font-mono text-xs text-muted-foreground">
                Horario: {DELIVERY_WINDOW_LABEL[row.shippingAddress.deliveryWindow] ??
                  row.shippingAddress.deliveryWindow}
              </p>
            )}
            {row.shippingAddress.notes && (
              <p className="mt-2 whitespace-pre-line text-xs text-muted-foreground">
                {row.shippingAddress.notes}
              </p>
            )}
          </div>
        </section>
      )}

      {(row.trackingNumber || row.trackingCarrier) && (
        <section className="mt-8 border border-brand/30 bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Seguimiento
          </h2>
          <div className="mt-4 space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Transportista: </span>
              {carrierLabel(row.trackingCarrier) ?? '—'}
            </p>
            {row.trackingNumber && (
              <p className="font-mono text-xs text-muted-foreground">N°: {row.trackingNumber}</p>
            )}
          </div>
          {trackingUrl(row.trackingCarrier, row.trackingNumber) && (
            <a
              href={trackingUrl(row.trackingCarrier, row.trackingNumber)!}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] text-brand hover:underline"
            >
              Seguir mi envío →
            </a>
          )}
        </section>
      )}
    </main>
  );
}
