import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { requireUser } from '@/lib/auth/dal';
import { getFavorites } from '@/lib/favorites/server';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Favoritos · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

const TYPE_LABEL: Record<string, string> = {
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

export default async function FavoritosPage() {
  const user = await requireUser();
  const favs = await getFavorites(user.id);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <header className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Tu selección
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[0.12em]">
          Favoritos
        </h1>
        <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />
      </header>

      {favs.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Todavía no guardaste ninguna genética. Tocá el corazón en cualquier
            genética del dispensario para sumarla acá.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-8 rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:bg-brand/10 hover:text-brand"
          >
            <Link href="/dispensario">Ir al dispensario</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((g) => (
            <li key={g.id}>
              <OrnateFrame className="group h-full">
                <Link href={`/dispensario/${g.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {g.images[0] ? (
                      <Image
                        src={g.images[0]}
                        alt={g.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted/30 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        sin foto
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-brand/50 bg-background/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand backdrop-blur">
                      {TYPE_LABEL[g.type] ?? g.type}
                    </span>
                    <FavoriteButton
                      geneticId={g.id}
                      initial
                      size="sm"
                      className="absolute right-3 top-3 z-10"
                    />
                  </div>
                </Link>

                <div className="flex items-end justify-between px-4 pb-5 pt-5">
                  <div>
                    <Link
                      href={`/dispensario/${g.slug}`}
                      className="font-display text-lg font-medium uppercase tracking-[0.16em] transition-colors hover:text-brand"
                    >
                      {g.name}
                    </Link>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {g.stock > 0 ? `${g.stock}g disponibles` : 'Sin stock'}
                    </p>
                  </div>
                  <p className="font-mono text-base text-brand">{formatPriceArs(g.priceCents)}</p>
                </div>
              </OrnateFrame>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
