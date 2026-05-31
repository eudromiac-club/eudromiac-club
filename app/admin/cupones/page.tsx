import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';
import { formatDate } from '@/lib/orders/labels';
import { NewCouponForm } from './new-coupon-form';
import { toggleCouponActiveAction, deleteCouponAction } from './actions';

export const metadata = {
  title: 'Cupones · Admin · EUDROMIA CLUB',
};

export default async function AdminCuponesPage() {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  const now = Date.now();

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Admin · Descuentos
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          <span className="text-brand">Cupones</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Creá códigos de descuento para tus socios. El cupón se ingresa en el carrito y
          baja el total según el porcentaje. Podés desactivarlo sin borrarlo, o ponerle un
          vencimiento.{' '}
          <span className="text-foreground">FULLOFF (100%)</span> está siempre disponible para
          probar el flujo de compra sin gastar.
        </p>
      </header>

      <NewCouponForm />

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Todavía no creaste ningún cupón. (FULLOFF sigue funcionando aunque no aparezca acá.)
          </p>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((c) => {
            const expired = c.expiresAt ? c.expiresAt.getTime() < now : false;
            const live = c.active && !expired;
            return (
              <li key={c.id} className="flex flex-wrap items-center gap-4 p-5">
                <span
                  className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                    live ? 'border-brand text-brand' : 'border-border text-muted-foreground'
                  }`}
                >
                  {expired ? '○ Vencido' : c.active ? '● Activo' : '○ Inactivo'}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm uppercase tracking-widest text-foreground">
                    {c.code}
                  </p>
                  {c.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                  )}
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Descuento
                  </p>
                  <p className="mt-0.5 font-mono text-brand">{c.discountPct}%</p>
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Vence
                  </p>
                  <p className="mt-0.5">{c.expiresAt ? formatDate(c.expiresAt) : 'Sin límite'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <form action={toggleCouponActiveAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="active" value={(!c.active).toString()} />
                    <button
                      type="submit"
                      className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      {c.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                  <form action={deleteCouponAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="border border-destructive/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-destructive transition-colors hover:bg-destructive/10"
                    >
                      Borrar
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
