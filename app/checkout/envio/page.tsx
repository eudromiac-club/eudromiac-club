import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { and, desc, eq, isNotNull } from 'drizzle-orm';

import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { orders, patientProfiles } from '@/lib/db/schema';
import { getCartSnapshot } from '@/lib/cart/server';
import { getAppliedCoupon, calcDiscount } from '@/lib/coupons';
import { ShippingForm, type ShippingDefaults } from './shipping-form';

export const metadata: Metadata = {
  title: 'Envío · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

function formatPriceArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function EnvioPage() {
  const user = await requireUser();
  if (user.status !== 'active' && user.role !== 'admin') redirect('/carrito');

  const cart = await getCartSnapshot(user.id);
  if (cart.items.length === 0) redirect('/carrito');

  const coupon = await getAppliedCoupon();
  const subtotalCents = cart.totalCents;
  const discountCents = calcDiscount(subtotalCents, coupon);
  const totalCents = subtotalCents - discountCents;
  const isFree = totalCents === 0;

  // Prefill: perfil del socio + dirección del último pedido que tenga una.
  const [profile] = await db
    .select({ fullName: patientProfiles.fullName, phone: patientProfiles.phone })
    .from(patientProfiles)
    .where(eq(patientProfiles.userId, user.id))
    .limit(1);

  const [last] = await db
    .select({ shippingAddress: orders.shippingAddress })
    .from(orders)
    .where(and(eq(orders.userId, user.id), isNotNull(orders.shippingAddress)))
    .orderBy(desc(orders.createdAt))
    .limit(1);
  const lastAddr = last?.shippingAddress ?? null;

  const defaults: ShippingDefaults = {
    recipientName: lastAddr?.recipientName ?? profile?.fullName ?? user.name ?? '',
    phone: lastAddr?.phone ?? profile?.phone ?? '',
    street: lastAddr?.street ?? '',
    city: lastAddr?.city ?? '',
    province: lastAddr?.province ?? '',
    postalCode: lastAddr?.postalCode ?? '',
    notes: lastAddr?.notes ?? '',
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <Link
          href="/carrito"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Volver al carrito
        </Link>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Paso 2 de 2 · Entrega
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          ¿A dónde lo <span className="text-brand">enviamos</span>?
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          El club hace envío a domicilio. Dejanos la dirección y un teléfono de contacto; el
          equipo coordina la entrega con vos.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_320px] md:items-start">
        <section className="border border-border bg-card p-6 sm:p-8">
          <ShippingForm defaults={defaults} isFree={isFree} />
        </section>

        <aside className="border border-brand/30 bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Tu pedido
          </h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <li key={item.geneticId} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block font-display uppercase tracking-[0.1em]">{item.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {item.quantity}g × {formatPriceArs(item.unitPriceCents)}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-sm">{formatPriceArs(item.subtotalCents)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm">
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
            <div className="flex items-center justify-between">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Envío
              </dt>
              <dd className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                A coordinar
              </dd>
            </div>
            <div className="flex items-end justify-between border-t border-border/60 pt-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Total
              </dt>
              <dd className="font-display text-2xl tabular-nums text-brand">
                {formatPriceArs(totalCents)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
