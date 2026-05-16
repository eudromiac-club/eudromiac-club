import Link from 'next/link';
import Image from 'next/image';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { toggleActiveAction } from './actions';

function formatPriceArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const TYPE_LABEL: Record<string, string> = {
  sativa: 'Sativa',
  indica: 'Indica',
  hybrid: 'Híbrida',
  cbd: 'CBD',
};

export default async function AdminGeneticsPage() {
  const rows = await db.select().from(genetics).orderBy(desc(genetics.createdAt));

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Admin · Catálogo
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
            Genéticas del <span className="text-brand">dispensario</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Cargá, editá o desactivá cada genética. Las que tengan "Activa" aparecen en el
            dispensario público para los socios validados.
          </p>
        </div>
        <Button
          asChild
          className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
        >
          <Link href="/admin/genetics/new">Nueva genética</Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Todavía no hay genéticas cargadas.
          </p>
          <Button asChild className="mt-5 rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
            <Link href="/admin/genetics/new">Cargar la primera</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-muted">
                {g.images[0] ? (
                  <Image
                    src={g.images[0]}
                    alt={g.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                    s/foto
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-medium uppercase tracking-[0.1em]">
                    {g.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brand">
                    {TYPE_LABEL[g.type]}
                  </span>
                  {!g.active && (
                    <span className="rounded-full border border-destructive/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-destructive">
                      inactiva
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  /{g.slug} · THC {g.thcPercent ?? '—'}% · CBD {g.cbdPercent ?? '—'}%
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Precio
                  </p>
                  <p className="mt-0.5 font-mono">{formatPriceArs(g.priceCents)}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Stock
                  </p>
                  <p className="mt-0.5 font-mono">{g.stock}g</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Cap/pedido
                  </p>
                  <p className="mt-0.5 font-mono">{g.maxPerOrderGrams ? `${g.maxPerOrderGrams}g` : '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <form action={toggleActiveAction}>
                  <input type="hidden" name="id" value={g.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-[11px] uppercase tracking-[0.2em]">
                    {g.active ? 'Desactivar' : 'Activar'}
                  </Button>
                </form>
                <Button asChild variant="outline" size="sm" className="rounded-none text-[11px] uppercase tracking-[0.2em]">
                  <Link href={`/admin/genetics/${g.id}`}>Editar</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
