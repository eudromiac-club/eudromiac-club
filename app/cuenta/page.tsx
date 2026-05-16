import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/dal';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Tu cuenta — eudromiac club',
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

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Hola, {user.name ?? user.email}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {statusLabel[user.status] ?? user.status}
        {user.role === 'admin' && ' · Administrador'}
      </p>

      {user.status === 'pending_kyc' && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h2 className="text-sm font-semibold">Falta validar tu permiso REPROCANN</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Para poder comprar necesitás cargar el número de tu permiso y el comprobante. El equipo
            del club revisa cada solicitud manualmente.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/cuenta/reprocann">Cargar mi permiso</Link>
          </Button>
        </div>
      )}

      <div className="space-y-2 rounded-lg border bg-card p-6">
        <p className="text-sm">
          <span className="text-muted-foreground">Email:</span> {user.email}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Rol:</span> {user.role}
        </p>
      </div>

      {user.role === 'admin' && (
        <Link
          href="/admin"
          className="mt-6 inline-block text-sm text-muted-foreground underline hover:text-foreground"
        >
          Ir al panel de admin →
        </Link>
      )}

      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </main>
  );
}
