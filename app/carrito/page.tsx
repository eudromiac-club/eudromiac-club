import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { and, desc, eq, gt, notInArray } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { getCartSnapshot } from '@/lib/cart/server';
import { getAppliedCoupon, calcDiscount } from '@/lib/coupons';
import { Button } from '@/components/ui/button';
import { AddToCartForm } from '@/components/cart/add-to-cart-form';
import { CartItemRow } from './cart-item-row';
import { CouponForm } from './coupon-form';

const HARD_CAP = 10;

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
  const coupon = await getAppliedCoupon();
  const subtotalCents = cart.totalCents;
  const discountCents = calcDiscount(subtotalCents, coupon);
  const totalCents = subtotalCents - discountCents;
  const isFree = cart.items.length > 0 && totalCents === 0;

  // Cross-sell: otras genéticas activas con stock que todavía no agregó, para
  // sumar al pedido sin salir del carrito.
  const cartIds = cart.items.map((i) => i.geneticId);
  const suggestions =
    cart.items.length > 0
      ? await db
          .select()
          .from(genetics)
          .where(
            and(
              eq(genetics.active, true),
              gt(genetics.stock, 0),
              cartIds.length > 0 ? notInArray(genetics.id, cartIds) : undefined,
            ),
          )
          .orderBy(desc(genetics.createdAt))
          .limit(3)
      : [];

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

          <section className="mt-8 grid gap-6 md:grid-cols-2 md:items-start">
            <div className="border border-border bg-card p-6">
              <CouponForm currentCode={coupon?.code ?? null} />
            </div>

            <div className="border border-brand/30 bg-card p-6">
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Subtotal ({cart.totalGrams}g)
                  </dt>
                  <dd className="font-mono">{formatPriceArs(subtotalCents)}</dd>
                </div>
                {discountCents > 0 && (
                  <div className="flex items-center justify-between text-brand">
                    <dt className="font-mono text-[10px] uppercase tracking-widest">
                      Descuento ({coupon?.code})
                    </dt>
                    <dd className="font-mono">− {formatPriceArs(discountCents)}</dd>
                  </div>
                )}
                <div className="flex items-end justify-between border-t border-border/60 pt-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Total
                  </dt>
                  <dd className="font-display text-3xl tabular-nums text-brand">
                    {formatPriceArs(totalCents)}
                  </dd>
                </div>
              </dl>

              <Button
                asChild
                className="mt-6 w-full rounded-none bg-brand px-8 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
              >
                <Link href="/checkout/envio">Continuar al envío →</Link>
              </Button>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {isFree
                  ? 'En el próximo paso cargás la dirección de envío y confirmás el pedido. El cupón cubre el 100%.'
                  : 'En el próximo paso cargás la dirección de envío y vas al pago con MercadoPago.'}
              </p>
            </div>
          </section>

          {suggestions.length > 0 && (
            <section className="mt-14">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-lg font-medium uppercase tracking-[0.16em]">
                  Completá tu <span className="text-brand">pedido</span>
                </h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Otras genéticas de la colección. Sumalas sin salir del carrito.
              </p>

              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((g) => (
                  <li key={g.id} className="flex flex-col border border-border bg-card">
                    <Link
                      href={`/dispensario/${g.slug}`}
                      className="group relative block aspect-[4/3] overflow-hidden bg-muted"
                    >
                      {g.images[0] ? (
                        <Image
                          src={g.images[0]}
                          alt={g.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          sin foto
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/dispensario/${g.slug}`} className="hover:text-brand">
                          <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em]">
                            {g.name}
                          </h3>
                        </Link>
                        <p className="shrink-0 font-mono text-sm text-brand">
                          {formatPriceArs(g.priceCents)}
                          <span className="text-[10px] text-muted-foreground">/g</span>
                        </p>
                      </div>
                      <div className="mt-auto">
                        <AddToCartForm
                          geneticId={g.id}
                          cap={Math.min(
                            HARD_CAP,
                            g.maxPerOrderGrams ? Math.floor(Number(g.maxPerOrderGrams)) : HARD_CAP,
                            g.stock,
                          )}
                          showGoToCart={false}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
