import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { parseGeneticDescription } from '@/lib/genetics/meta';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { AddToCartForm } from '@/components/cart/add-to-cart-form';
import { CartStickyCta } from '@/components/cart/cart-sticky-cta';
import { getCartSnapshot } from '@/lib/cart/server';
import { getMonthlyCap, getMonthlyConsumption } from '@/lib/users/consumption';

const HARD_CAP = 10;

const TYPE_LABEL: Record<string, string> = {
  sativa: 'Sativa Dominant',
  indica: 'Indica Dominant',
  hybrid: 'Híbrida',
  cbd: 'CBD',
};

function formatPriceArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [g] = await db
    .select({ name: genetics.name })
    .from(genetics)
    .where(eq(genetics.slug, slug))
    .limit(1);
  return {
    title: g ? `${g.name} · Dispensario · EUDROMIA CLUB` : 'Dispensario · EUDROMIA CLUB',
    robots: { index: false, follow: false },
  };
}

export default async function GeneticDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const isActive = user.status === 'active' || user.role === 'admin';

  const [g] = await db.select().from(genetics).where(eq(genetics.slug, slug)).limit(1);
  if (!g || !g.active) notFound();

  const meta = parseGeneticDescription(g.description);

  const cartSnap = isActive
    ? await getCartSnapshot(user.id)
    : { itemCount: 0, totalCents: 0, totalGrams: 0, items: [] };

  let remaining: number | null = null;
  if (isActive && user.role !== 'admin') {
    const cap = await getMonthlyCap(user.id);
    if (cap != null) {
      const consumed = (await getMonthlyConsumption(user.id)).grams;
      remaining = Math.max(cap - consumed, 0);
    }
  }

  const addCap = Math.min(
    HARD_CAP,
    g.maxPerOrderGrams ? Math.floor(Number(g.maxPerOrderGrams)) : HARD_CAP,
    g.stock,
    remaining ?? HARD_CAP,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/dispensario"
        className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-brand"
      >
        ← Volver al dispensario
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start">
        <OrnateFrame>
          <div className="relative aspect-[4/5] overflow-hidden">
            {g.images[0] ? (
              <Image
                src={g.images[0]}
                alt={g.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted/30 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Sin foto
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full border border-brand/50 bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">
              {TYPE_LABEL[g.type] ?? g.type}
            </span>
          </div>
        </OrnateFrame>

        <article className="space-y-8">
          <header>
            {meta.cross && (
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {meta.cross}
              </p>
            )}
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-tight tracking-[0.08em] text-foreground">
              {g.name}
            </h1>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-brand to-transparent" />
          </header>

          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {meta.description}
          </p>

          <dl className="grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
            <div className="bg-card p-4">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                THC
              </dt>
              <dd className="mt-1 font-mono text-lg text-brand">
                {g.thcPercent ? `${g.thcPercent}%` : '—'}
              </dd>
            </div>
            <div className="bg-card p-4">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                CBD
              </dt>
              <dd className="mt-1 font-mono text-lg text-brand">
                {g.cbdPercent ? `${g.cbdPercent}%` : '—'}
              </dd>
            </div>
            <div className="bg-card p-4">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Terpenos
              </dt>
              <dd className="mt-1 font-mono text-lg text-brand">
                {meta.terpenes ? `${meta.terpenes}%` : '—'}
              </dd>
            </div>
          </dl>

          <div className="border-t border-border/60 pt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Precio por gramo
                </p>
                <p className="mt-2 font-display text-3xl text-brand">
                  {formatPriceArs(g.priceCents)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Stock · cap
                </p>
                <p className="mt-2 font-mono text-sm">
                  {g.stock}g · {g.maxPerOrderGrams ? `${g.maxPerOrderGrams}g/pedido` : '—'}
                </p>
              </div>
            </div>

            {isActive && g.stock > 0 && addCap > 0 && (
              <div className="mt-6">
                <AddToCartForm geneticId={g.id} cap={addCap} />
              </div>
            )}
            {isActive && g.stock === 0 && (
              <p className="mt-6 border border-destructive/40 bg-destructive/10 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-destructive">
                Sin stock disponible
              </p>
            )}
            {isActive && g.stock > 0 && addCap === 0 && remaining === 0 && (
              <p className="mt-6 border border-brand/40 bg-brand/5 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-brand">
                Llegaste a tu cap mensual REPROCANN
              </p>
            )}
            {!isActive && (
              <p className="mt-6 border border-brand/40 bg-brand/5 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-brand">
                Validá tu permiso para comprar
              </p>
            )}
          </div>
        </article>
      </div>

      <CartStickyCta itemCount={cartSnap.itemCount} totalCents={cartSnap.totalCents} />
    </main>
  );
}
