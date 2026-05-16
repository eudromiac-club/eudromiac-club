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
  active: 'Socio activo',
  suspended: 'Suspendida',
  inactive: 'Inactiva',
};

export default async function CuentaPage() {
  const user = await requireUser();
  const isPending = user.status === 'pending_kyc';

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Tu cuenta
        </p>
        <h1 className="mt-2 font-display text-4xl italic tracking-tight">
          Hola, {user.name ?? user.email?.split('@')[0] ?? 'socio'}.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {statusLabel[user.status] ?? user.status}
          {user.role === 'admin' && ' · administrador'}
        </p>
      </header>

      {isPending && (
        <section
          aria-labelledby="kyc-title"
          className="mb-10 rounded-xl border border-amber-300/70 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30"
        >
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-amber-800 dark:text-amber-400">
            Acción requerida
          </p>
          <h2 id="kyc-title" className="mt-2 font-display text-2xl italic tracking-tight">
            Falta validar tu permiso REPROCANN.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Para poder comprar necesitás cargar el número de tu permiso, el vencimiento y el
            comprobante. El equipo del club revisa cada solicitud uno a uno.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <Link href="/cuenta/reprocann">Cargar mi permiso</Link>
          </Button>
        </section>
      )}

      <section className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
        <div className="bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</p>
          <p className="mt-2 text-sm">{user.email}</p>
        </div>
        <div className="bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Rol</p>
          <p className="mt-2 text-sm">{user.role === 'admin' ? 'Administrador' : 'Socio'}</p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/cuenta/reprocann"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-foreground/30"
        >
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-brand">REPROCANN</p>
          <h3 className="mt-3 font-display text-2xl italic tracking-tight">Mi permiso</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargar o actualizar el comprobante de tu permiso vigente.
          </p>
          <span className="mt-4 inline-block text-sm group-hover:underline">Ir →</span>
        </Link>

        <div className="rounded-xl border border-dashed bg-card/40 p-6 text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-[0.15em]">Próximamente</p>
          <p className="mt-3">Tus pedidos, direcciones de envío y cap mensual disponible.</p>
        </div>
      </section>

      {user.role === 'admin' && (
        <p className="mt-10 text-sm">
          <Link href="/admin" className="text-muted-foreground underline hover:text-foreground">
            Ir al panel de administración →
          </Link>
        </p>
      )}
    </main>
  );
}
