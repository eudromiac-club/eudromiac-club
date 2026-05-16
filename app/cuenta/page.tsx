import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/dal';
import { Button } from '@/components/ui/button';

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
  const isAdmin = user.role === 'admin';
  const displayName = user.name ?? user.email?.split('@')[0] ?? 'socio';

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

      {isPending && (
        <section
          aria-labelledby="kyc-title"
          className="relative mb-10 overflow-hidden border border-brand/30 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 shadow-[0_0_60px_-20px_hsl(var(--brand)/0.4)]"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-50"
            style={{
              background: 'radial-gradient(circle, hsl(32 70% 50% / 0.45), transparent 70%)',
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

        {isAdmin ? (
          <Link
            href="/admin"
            className="group relative overflow-hidden border border-brand/40 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 transition-colors hover:border-brand"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-40 transition-opacity group-hover:opacity-70"
              style={{
                background: 'radial-gradient(circle, hsl(32 70% 50% / 0.5), transparent 70%)',
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
              Gestionar invitaciones, socios y catálogo del club.
            </p>
            <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
              Ingresar →
            </span>
          </Link>
        ) : (
          <div className="border border-dashed border-border bg-card/40 p-6 text-sm text-muted-foreground">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em]">Próximamente</p>
            <p className="mt-3">Tus pedidos, direcciones de envío y cap mensual disponible.</p>
          </div>
        )}
      </section>
    </main>
  );
}
