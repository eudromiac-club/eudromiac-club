import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';

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
            Pedido <span className="text-brand">#{row.id.slice(0, 8)}</span>
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
        <div className="flex items-center justify-between border-t border-border p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Total
          </span>
          <span className="font-display text-2xl tabular-nums text-brand">
            {formatPriceArs(row.totalCents)}
          </span>
        </div>
      </section>
    </main>
  );
}
