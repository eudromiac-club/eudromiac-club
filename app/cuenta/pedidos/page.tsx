import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';

export const metadata: Metadata = {
  title: 'Mis pedidos · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function MisPedidosPage() {
  const user = await requireUser();

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
      itemsCount: sql<number>`(select coalesce(sum(${orderItems.quantity}), 0)::int from ${orderItems} where ${orderItems.orderId} = ${orders.id})`,
    })
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <Link
          href="/cuenta"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Volver a mi cuenta
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Mis <span className="text-brand">pedidos</span>.
        </h1>
      </header>

      {rows.length === 0 ? (
        <section className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">Todavía no hiciste ningún pedido.</p>
          <Button asChild className="mt-6 rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
            <Link href="/dispensario">Ir al dispensario</Link>
          </Button>
        </section>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/cuenta/pedidos/${r.id}`}
                className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-muted/40"
              >
                <span
                  className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                    ORDER_STATUS_COLOR[r.status] ?? 'border-border text-muted-foreground'
                  }`}
                >
                  {ORDER_STATUS_LABEL[r.status] ?? r.status}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-medium uppercase tracking-[0.12em]">
                    Pedido <span className="text-brand">{r.orderNumber ?? `#${r.id.slice(0, 8)}`}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Items
                  </p>
                  <p className="mt-0.5 font-mono">{r.itemsCount}g</p>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-brand">{formatPriceArs(r.totalCents)}</p>
                </div>

                <span className="text-[11px] uppercase tracking-[0.2em] text-brand">Ver →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
