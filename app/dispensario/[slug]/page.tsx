import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { parseGeneticDescription } from '@/lib/genetics/meta';
import { geneticVideoSrc, geneticPackagingSrc } from '@/lib/genetics/video';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { GeneticVideo } from '@/components/dispensario/genetic-video';
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

// Versión corta para la ficha de specs (estilo mockup, columna angosta).
const TYPE_SHORT: Record<string, string> = {
  sativa: 'Sativa',
  indica: 'Indica',
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
  const videoSrc = geneticVideoSrc(g.slug);
  const packaging = geneticPackagingSrc(g.slug);

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

      {/* Media grande arriba: video a todo el ancho (16:9), o foto vertical centrada */}
      <div className={`mt-8 ${videoSrc ? '' : 'mx-auto max-w-md'}`}>
        <OrnateFrame>
          <div className={`relative overflow-hidden ${videoSrc ? 'aspect-video' : 'aspect-[4/5]'}`}>
            {videoSrc ? (
              <GeneticVideo src={videoSrc} poster={g.images[0] ?? null} alt={g.name} />
            ) : g.images[0] ? (
              <Image
                src={g.images[0]}
                alt={g.name}
                fill
                priority
                sizes="(min-width: 768px) 28rem, 100vw"
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
      </div>

      {/* Info abajo: descripción + ficha a la izquierda, caja de compra a la derecha */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <article className="space-y-8">
          <header>
            <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] font-medium uppercase leading-tight tracking-[0.08em] text-foreground">
              {g.name}
            </h1>
            <p className="mt-2 font-display text-sm uppercase tracking-[0.4em] text-brand sm:text-base">
              {g.type === 'cbd' ? 'Flor CBD' : 'Flor Premium'}
            </p>
            {meta.cross && (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {meta.cross}
              </p>
            )}
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-brand to-transparent" />
          </header>

          <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">
            {meta.description}
          </p>

          <dl className="flex divide-x divide-border border-y border-border">
            <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                THC
              </dt>
              <dd className="mt-1.5 font-mono text-xl text-brand sm:text-2xl">
                {g.thcPercent ? `${g.thcPercent}%` : '—'}
              </dd>
            </div>
            <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Tipo
              </dt>
              <dd className="mt-1.5 font-display text-lg text-foreground sm:text-xl">
                {TYPE_SHORT[g.type] ?? g.type}
              </dd>
            </div>
            <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
              <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Terpenos
              </dt>
              <dd className="mt-1.5 font-mono text-xl text-brand sm:text-2xl">
                {meta.terpenes ? `${meta.terpenes}%` : '—'}
              </dd>
            </div>
          </dl>

          {packaging && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                El packaging
              </p>
              <div className="mt-3 overflow-hidden border border-border">
                <div className="relative aspect-[3/2]">
                  <GeneticVideo
                    src={packaging.src}
                    poster={packaging.poster}
                    alt={`Packaging de ${g.name}`}
                  />
                </div>
              </div>
            </div>
          )}
        </article>

        <aside className="border border-brand/30 bg-card p-6 sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Precio por gramo
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {g.stock}g en stock
            </p>
          </div>
          <p className="mt-2 font-display text-4xl text-brand sm:text-5xl">
            {formatPriceArs(g.priceCents)}
          </p>
          {g.maxPerOrderGrams && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Hasta {g.maxPerOrderGrams}g por pedido
            </p>
          )}

          {isActive && g.stock > 0 && addCap > 0 && (
            <div className="mt-7">
              <AddToCartForm geneticId={g.id} cap={addCap} showcase />
            </div>
          )}
          {isActive && g.stock === 0 && (
            <p className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-destructive">
              Sin stock disponible
            </p>
          )}
          {isActive && g.stock > 0 && addCap === 0 && remaining === 0 && (
            <p className="mt-6 rounded-md border border-brand/40 bg-brand/5 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-brand">
              Llegaste a tu cap mensual REPROCANN
            </p>
          )}
          {!isActive && (
            <p className="mt-6 rounded-md border border-brand/40 bg-brand/5 p-3 text-center text-[11px] uppercase tracking-[0.2em] text-brand">
              Validá tu permiso para comprar
            </p>
          )}
        </aside>
      </div>

      <CartStickyCta itemCount={cartSnap.itemCount} totalCents={cartSnap.totalCents} />
    </main>
  );
}
