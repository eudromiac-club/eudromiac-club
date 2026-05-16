import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { eq, desc } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { OrnateFrame } from '@/components/brand/ornate-frame';

export const metadata: Metadata = {
  title: 'Dispensario · EUDROMIA CLUB',
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

export default async function DispensarioPage() {
  const user = await requireUser();
  const isActive = user.status === 'active' || user.role === 'admin';
  const isLocked = !isActive;
  const lockMsg =
    user.status === 'pending_kyc'
      ? {
          eyebrow: '◆ Acceso bloqueado',
          title: 'Validá tu permiso REPROCANN.',
          body: 'Para ver el detalle y reservar genéticas necesitás cargar tu permiso vigente. El equipo revisa cada solicitud uno a uno.',
          cta: 'Cargar mi permiso',
          href: '/cuenta/reprocann',
          variant: 'brand' as const,
        }
      : user.status === 'under_review'
        ? {
            eyebrow: '◆ En revisión',
            title: 'Tu solicitud está siendo revisada.',
            body: 'Ya tenemos tu documentación. El acceso al dispensario se desbloquea cuando el equipo apruebe tu solicitud.',
            cta: 'Ver mi solicitud',
            href: '/cuenta/reprocann',
            variant: 'brand' as const,
          }
        : user.status === 'rejected'
          ? {
              eyebrow: '◆ Solicitud rechazada',
              title: 'No podés acceder al dispensario.',
              body: 'Tu solicitud fue rechazada. Contactá al club para entender el motivo y reenviar la documentación.',
              cta: 'Volver a enviar',
              href: '/cuenta/reprocann',
              variant: 'destructive' as const,
            }
          : {
              eyebrow: '◆ Acceso bloqueado',
              title: 'Tu cuenta no puede operar.',
              body: 'Contactá al club para más información.',
              cta: 'Volver a mi cuenta',
              href: '/cuenta',
              variant: 'destructive' as const,
            };

  const rows = await db
    .select()
    .from(genetics)
    .where(eq(genetics.active, true))
    .orderBy(desc(genetics.createdAt));

  return (
    <main className="relative mx-auto w-full max-w-6xl px-6 py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Colección activa
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase tracking-[0.12em]">
          <span className="block">Dispensario</span>
          <span className="block text-brand">privado.</span>
        </h1>
        <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Genéticas curadas, disponibles exclusivamente para socios con permiso REPROCANN vigente.
        </p>
      </header>

      {isLocked && (
        <section
          aria-labelledby="lock-block"
          className={`relative mx-auto mt-12 max-w-2xl overflow-hidden border p-8 text-center ${
            lockMsg.variant === 'brand'
              ? 'border-brand/40 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] shadow-[0_0_80px_-20px_hsl(var(--brand)/0.5)]'
              : 'border-destructive/40 bg-destructive/10'
          }`}
        >
          {lockMsg.variant === 'brand' && (
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-50"
              style={{
                background: 'radial-gradient(circle, hsl(32 70% 50% / 0.55), transparent 70%)',
                filter: 'blur(50px)',
              }}
              aria-hidden
            />
          )}
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
              lockMsg.variant === 'brand' ? 'text-brand' : 'text-destructive'
            }`}
          >
            {lockMsg.eyebrow}
          </p>
          <h2
            id="lock-block"
            className="mt-3 font-display text-2xl font-medium uppercase tracking-[0.1em]"
          >
            {lockMsg.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {lockMsg.body}
          </p>
          <Button
            asChild
            variant="outline"
            className={`mt-6 rounded-none bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] ${
              lockMsg.variant === 'brand'
                ? 'border-brand/60 text-brand hover:bg-brand/10 hover:text-brand'
                : 'border-destructive/60 text-destructive hover:bg-destructive/10'
            }`}
          >
            <Link href={lockMsg.href}>{lockMsg.cta}</Link>
          </Button>
        </section>
      )}

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Todavía no hay genéticas disponibles. Volvé pronto.
        </p>
      ) : (
        <ul className={`mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${isLocked ? 'pointer-events-none opacity-40' : ''}`}>
          {rows.map((g) => (
            <li key={g.id}>
              <OrnateFrame className="group h-full">
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
                </div>

                <div className="space-y-4 px-4 pb-5 pt-6">
                  <div>
                    <h3 className="font-display text-lg font-medium uppercase tracking-[0.16em]">
                      {g.name}
                    </h3>
                    {g.description && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {g.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-between border-t border-border/60 pt-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Precio
                      </p>
                      <p className="font-mono text-base text-brand">{formatPriceArs(g.priceCents)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Disp. · cap
                      </p>
                      <p className="font-mono text-xs">
                        {g.stock}g · {g.maxPerOrderGrams ? `${g.maxPerOrderGrams}g` : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {g.thcPercent && <span>THC {g.thcPercent}%</span>}
                    {g.cbdPercent && <span>CBD {g.cbdPercent}%</span>}
                  </div>
                </div>
              </OrnateFrame>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
