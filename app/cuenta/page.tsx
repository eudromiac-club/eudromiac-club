import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/dal';
import { Button } from '@/components/ui/button';
import { getMonthlyCap, getMonthlyConsumption } from '@/lib/users/consumption';
import { getNextShipment } from '@/lib/orders/next-shipment';
import { NextShipmentCard } from '@/components/cuenta/member-cards';

export const metadata: Metadata = {
  title: 'Mi cuenta · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  pending_kyc: 'Pendiente de verificación',
  under_review: 'En revisión',
  active: 'Socio activo',
  rejected: 'Solicitud rechazada',
  suspended: 'Suspendida',
  inactive: 'Inactiva',
};

export default async function CuentaPage() {
  const user = await requireUser();
  const isPending = user.status === 'pending_kyc';
  const isUnderReview = user.status === 'under_review';
  const isRejected = user.status === 'rejected';
  const isActive = user.status === 'active';
  const isAdmin = user.role === 'admin';
  const displayName = user.name ?? user.email?.split('@')[0] ?? 'socio';

  // Solo para socios activos: mostramos consumo del mes vs cap autorizado.
  const consumption = isActive && !isAdmin ? await getMonthlyConsumption(user.id) : null;
  const monthlyCap = isActive && !isAdmin ? await getMonthlyCap(user.id) : null;

  // Próximo envío (pedido en curso), solo para socios activos.
  const showShipment = isActive && !isAdmin;
  const nextShipment = showShipment ? await getNextShipment(user.id) : null;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Tu cuenta
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Hola, <span className="text-brand">{displayName}</span>.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {statusLabel[user.status] ?? user.status}
          {isAdmin && ' · administrador'}
        </p>
      </header>

      {showShipment && nextShipment && (
        <div className="mb-10">
          <NextShipmentCard shipment={nextShipment} />
        </div>
      )}

      {isPending && (
        <section
          aria-labelledby="kyc-title"
          className="relative mb-10 overflow-hidden border border-brand/30 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 shadow-[0_0_60px_-20px_hsl(var(--brand)/0.4)]"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-50"
            style={{
              background: 'radial-gradient(circle, hsl(42 70% 50% / 0.45), transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Acción requerida
          </p>
          <h2
            id="kyc-title"
            className="mt-3 font-display text-2xl font-medium uppercase tracking-[0.1em]"
          >
            Falta validar tu permiso <span className="text-brand">REPROCANN</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Para poder acceder al santuario y a la colección necesitás cargar el número de tu
            permiso, el vencimiento y el comprobante. El equipo del club revisa cada solicitud
            uno a uno.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:border-brand hover:bg-brand/10 hover:text-brand"
          >
            <Link href="/cuenta/reprocann">Cargar mi permiso</Link>
          </Button>
        </section>
      )}

      {isUnderReview && (
        <section
          aria-labelledby="kyc-review-title"
          className="relative mb-10 overflow-hidden border border-brand/30 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ En revisión
          </p>
          <h2 id="kyc-review-title" className="mt-3 font-display text-2xl font-medium uppercase tracking-[0.1em]">
            Tu solicitud está siendo <span className="text-brand">revisada</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Ya tenemos tu documentación. El equipo revisa cada solicitud uno a uno y te avisamos
            cuando esté lista.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:bg-brand/10 hover:text-brand"
          >
            <Link href="/cuenta/reprocann">Ver mi solicitud</Link>
          </Button>
        </section>
      )}

      {isRejected && (
        <section
          aria-labelledby="kyc-rejected-title"
          className="relative mb-10 overflow-hidden border border-destructive/40 bg-destructive/10 p-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
            ◆ Solicitud rechazada
          </p>
          <h2 id="kyc-rejected-title" className="mt-3 font-display text-2xl font-medium uppercase tracking-[0.1em]">
            Tu solicitud fue <span className="text-destructive">rechazada</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Podés contactar al club para entender el motivo y reenviar tu documentación corregida.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-5 rounded-none border-destructive/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-destructive hover:bg-destructive/10"
          >
            <Link href="/cuenta/reprocann">Volver a enviar</Link>
          </Button>
        </section>
      )}

      {consumption && (() => {
        const grams = consumption.grams;
        const cap = monthlyCap;
        const remaining = cap != null ? Math.max(cap - grams, 0) : null;
        const pct = cap != null && cap > 0 ? Math.min(100, Math.round((grams / cap) * 100)) : 0;
        const exceeded = cap != null && grams > cap;
        const barColor = exceeded ? 'bg-destructive' : pct >= 80 ? 'bg-yellow-500' : 'bg-brand';

        return (
          <section className="mb-10 border border-brand/30 bg-card p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
                  ◆ Consumo mensual
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {consumption.monthLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Consumido / Cap
                </p>
                <p className="mt-1 font-mono text-2xl text-brand">
                  {grams}g
                  <span className="ml-1 text-base text-muted-foreground">
                    / {cap != null ? `${cap}g` : 'sin cap'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all ${barColor}`}
                style={{ width: `${cap != null ? pct : 0}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {cap == null ? (
                <>El cap mensual se configura desde el panel del club según tu REPROCANN.</>
              ) : exceeded ? (
                <>Superaste el cap por <span className="text-destructive">{grams - cap}g</span> este mes.</>
              ) : (
                <>Te quedan <span className="text-foreground">{remaining}g</span> disponibles este mes.</>
              )}
            </p>
          </section>
        );
      })()}

      <section className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        <div className="bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Email
          </p>
          <p className="mt-2 text-sm">{user.email}</p>
        </div>
        <div className="bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Rol
          </p>
          <p className="mt-2 text-sm">{isAdmin ? 'Administrador' : 'Socio'}</p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/cuenta/reprocann"
          className="group relative overflow-hidden border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">REPROCANN</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Mi permiso
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargar o actualizar el comprobante de tu permiso vigente.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ir →
          </span>
        </Link>

        <Link
          href="/cuenta/pedidos"
          className="group relative overflow-hidden border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">Historial</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Mis pedidos
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Estado de cada pedido: aprobado, en tránsito, entregado.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ver →
          </span>
        </Link>
      </section>

      {isAdmin && (
        <section className="mt-6">
          <Link
            href="/admin"
            className="group relative block overflow-hidden border border-brand/40 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 transition-colors hover:border-brand"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-40 transition-opacity group-hover:opacity-70"
              style={{
                background: 'radial-gradient(circle, hsl(42 70% 50% / 0.5), transparent 70%)',
                filter: 'blur(30px)',
              }}
              aria-hidden
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
              ◆ Panel privado
            </p>
            <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
              Administración
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestionar invitaciones, solicitudes, genéticas y pedidos del club.
            </p>
            <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
              Ingresar →
            </span>
          </Link>
        </section>
      )}
    </main>
  );
}
