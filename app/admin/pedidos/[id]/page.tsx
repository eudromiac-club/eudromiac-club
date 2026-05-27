import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, users, orderItems, patientProfiles } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';
import { updateOrderStatusAction } from '../actions';

export const metadata = {
  title: 'Pedido · Admin · EUDROMIA CLUB',
};

// Acciones permitidas según el estado actual.
const NEXT_ACTIONS: Record<string, Array<{ to: string; label: string; tone: 'brand' | 'neutral' | 'destructive' }>> = {
  pending: [
    { to: 'paid', label: 'Marcar como pagado', tone: 'brand' },
    { to: 'cancelled', label: 'Cancelar', tone: 'destructive' },
  ],
  paid: [
    { to: 'shipped', label: 'Marcar en tránsito', tone: 'brand' },
    { to: 'cancelled', label: 'Cancelar', tone: 'destructive' },
    { to: 'refunded', label: 'Reembolsar', tone: 'neutral' },
  ],
  shipped: [
    { to: 'delivered', label: 'Marcar entregado', tone: 'brand' },
    { to: 'cancelled', label: 'Cancelar', tone: 'destructive' },
  ],
  delivered: [
    { to: 'refunded', label: 'Reembolsar', tone: 'neutral' },
  ],
  cancelled: [],
  refunded: [],
};

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotalCents: orders.subtotalCents,
      discountCents: orders.discountCents,
      couponCode: orders.couponCode,
      totalCents: orders.totalCents,
      shippingAddress: orders.shippingAddress,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      mpPreferenceId: orders.mpPreferenceId,
      mpPaymentId: orders.mpPaymentId,
      userId: orders.userId,
      userEmail: users.email,
      userName: users.name,
      profileName: patientProfiles.fullName,
      profileDni: patientProfiles.dni,
      profilePhone: patientProfiles.phone,
      profileReprocann: patientProfiles.reprocannNumber,
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .leftJoin(patientProfiles, eq(patientProfiles.userId, orders.userId))
    .where(eq(orders.id, id))
    .limit(1);

  if (!row) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, row.id));

  const nextActions = NEXT_ACTIONS[row.status] ?? [];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/pedidos"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            ← Volver a pedidos
          </Link>
          <h1 className="mt-4 font-display text-2xl font-medium uppercase tracking-[0.1em] sm:text-3xl">
            Pedido{' '}
            <span className="text-brand">{row.orderNumber ?? `#${row.id.slice(0, 8)}`}</span>
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDate(row.createdAt)} · actualizado {formatDate(row.updatedAt)}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.25em] ${
            ORDER_STATUS_COLOR[row.status] ?? 'border-border text-muted-foreground'
          }`}
        >
          {ORDER_STATUS_LABEL[row.status] ?? row.status}
        </span>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Cliente
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nombre</dt>
              <dd className="mt-0.5">{row.profileName ?? row.userName ?? row.userEmail}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</dt>
              <dd className="mt-0.5">{row.userEmail}</dd>
            </div>
            {row.profileDni && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DNI</dt>
                <dd className="mt-0.5">{row.profileDni}</dd>
              </div>
            )}
            {row.profilePhone && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Teléfono</dt>
                <dd className="mt-0.5">{row.profilePhone}</dd>
              </div>
            )}
            {row.profileReprocann && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">REPROCANN</dt>
                <dd className="mt-0.5 font-mono">{row.profileReprocann}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ MercadoPago
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Preference ID
              </dt>
              <dd className="mt-0.5 font-mono text-xs">{row.mpPreferenceId ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Payment ID
              </dt>
              <dd className="mt-0.5 font-mono text-xs">{row.mpPaymentId ?? '—'}</dd>
            </div>
            {row.mpPaymentId && (
              <a
                href={`https://www.mercadopago.com.ar/activities/${row.mpPaymentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand hover:underline"
              >
                Ver en MercadoPago →
              </a>
            )}
          </dl>
        </div>
      </section>

      <section className="border border-border bg-card p-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Envío
        </h2>
        {row.shippingAddress ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Recibe
              </dt>
              <dd className="mt-0.5">{row.shippingAddress.recipientName}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Teléfono
              </dt>
              <dd className="mt-0.5">
                <a
                  href={`tel:${row.shippingAddress.phone}`}
                  className="text-brand hover:underline"
                >
                  {row.shippingAddress.phone}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Dirección
              </dt>
              <dd className="mt-0.5">
                {row.shippingAddress.street}, {row.shippingAddress.city},{' '}
                {row.shippingAddress.province}
                {row.shippingAddress.postalCode ? ` (CP ${row.shippingAddress.postalCode})` : ''}
              </dd>
            </div>
            {row.shippingAddress.notes && (
              <div className="sm:col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Notas
                </dt>
                <dd className="mt-0.5 whitespace-pre-line text-muted-foreground">
                  {row.shippingAddress.notes}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Sin dirección de envío (pedido anterior a esta función).
          </p>
        )}
      </section>

      <section className="border border-border bg-card">
        <h2 className="border-b border-border p-5 font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Items
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
        </div>
      </section>

      {nextActions.length > 0 && (
        <section className="border border-brand/30 bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Acciones
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {nextActions.map((a) => (
              <form key={a.to} action={updateOrderStatusAction}>
                <input type="hidden" name="orderId" value={row.id} />
                <input type="hidden" name="status" value={a.to} />
                <Button
                  type="submit"
                  variant={a.tone === 'brand' ? 'default' : 'outline'}
                  className={`rounded-none px-5 py-4 text-[11px] uppercase tracking-[0.25em] ${
                    a.tone === 'destructive'
                      ? 'border-destructive/60 bg-transparent text-destructive hover:bg-destructive/10'
                      : a.tone === 'brand'
                        ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                        : 'border-border hover:border-foreground/40'
                  }`}
                >
                  {a.label}
                </Button>
              </form>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
