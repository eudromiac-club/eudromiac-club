import Link from 'next/link';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, users, orderItems } from '@/lib/db/schema';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_ORDER,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';

export const metadata = {
  title: 'Pedidos · Admin · EUDROMIA CLUB',
};

type SP = { status?: string };

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const { status } = await searchParams;
  const filterStatus = status && ORDER_STATUS_ORDER.includes(status as never) ? status : null;

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalCents: orders.totalCents,
      couponCode: orders.couponCode,
      createdAt: orders.createdAt,
      userEmail: users.email,
      userName: users.name,
      itemsCount: sql<number>`(select coalesce(sum(${orderItems.quantity}), 0)::int from ${orderItems} where ${orderItems.orderId} = ${orders.id})`,
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(filterStatus ? eq(orders.status, filterStatus as 'pending') : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Admin · Operación
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          <span className="text-brand">Pedidos</span>.
        </h1>
      </header>

      <nav className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
        <Link
          href="/admin/pedidos"
          className={`border px-3 py-1.5 transition-colors ${
            !filterStatus
              ? 'border-brand bg-brand/10 text-brand'
              : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
          }`}
        >
          Todos
        </Link>
        {ORDER_STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`border px-3 py-1.5 transition-colors ${
              filterStatus === s
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            {ORDER_STATUS_LABEL[s]}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No hay pedidos en este filtro.</p>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/pedidos/${r.id}`}
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
                  <p className="text-sm">
                    <span className="mr-2 font-mono text-xs tracking-widest text-brand">
                      {r.orderNumber ?? `#${r.id.slice(0, 8)}`}
                    </span>
                    {r.userName ?? r.userEmail}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.userEmail}
                    {r.couponCode && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-brand">
                        · {r.couponCode}
                      </span>
                    )}
                  </p>
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Fecha
                  </p>
                  <p className="mt-0.5">{formatDate(r.createdAt)}</p>
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Items
                  </p>
                  <p className="mt-0.5 font-mono">{r.itemsCount}g</p>
                </div>

                <div className="text-right text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-0.5 font-mono text-brand">{formatPriceArs(r.totalCents)}</p>
                </div>

                <span className="text-[11px] uppercase tracking-[0.2em] text-brand">Ver →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
