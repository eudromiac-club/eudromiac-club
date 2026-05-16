import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { requireUser } from '@/lib/auth/dal';
import { getCartSnapshot } from '@/lib/cart/server';
import { Button } from '@/components/ui/button';
import { CartItemRow } from './cart-item-row';
import { startCheckoutAction } from './checkout-action';

export const metadata: Metadata = {
  title: 'Carrito · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

function formatPriceArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function CarritoPage() {
  const user = await requireUser();

  // Bloqueado si no está activo
  if (user.status !== 'active' && user.role !== 'admin') {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Tu cuenta no <span className="text-brand">puede comprar</span> aún.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Necesitás tener tu permiso REPROCANN validado para acceder al carrito y al dispensario.
        </p>
        <Button asChild className="mt-8 rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
          <Link href="/cuenta/reprocann">Ir a mi solicitud</Link>
        </Button>
      </main>
    );
  }

  const cart = await getCartSnapshot(user.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Tu pedido
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          <span className="text-brand">Carrito</span>.
        </h1>
      </header>

      {cart.items.length === 0 ? (
        <section className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">Todavía no agregaste nada.</p>
          <Button asChild className="mt-6 rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
            <Link href="/dispensario">Ir al dispensario</Link>
          </Button>
        </section>
      ) : (
        <>
          <ul className="divide-y border border-border bg-card">
            {cart.items.map((item) => (
              <li key={item.geneticId} className="flex flex-wrap items-center gap-4 p-5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-muted-foreground">
                      s/foto
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em]">
                    {item.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {formatPriceArs(item.unitPriceCents)} / g
                  </p>
                </div>

                <CartItemRow geneticId={item.geneticId} quantity={item.quantity} cap={item.cap} />

                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Subtotal
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-brand">
                    {formatPriceArs(item.subtotalCents)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <section className="mt-8 border border-brand/30 bg-card p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Total ({cart.totalGrams}g)
                </p>
                <p className="mt-2 font-display text-4xl tabular-nums text-brand">
                  {formatPriceArs(cart.totalCents)}
                </p>
              </div>
              <form action={startCheckoutAction}>
                <Button
                  type="submit"
                  className="rounded-none bg-brand px-8 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
                >
                  Pagar con MercadoPago
                </Button>
              </form>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Al pagar te redirigimos a MercadoPago. Confirmás el pago ahí y volvés a tu cuenta con
              el pedido registrado.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
