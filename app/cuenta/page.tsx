import type { Metadata } from 'next';
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

      <div className="space-y-2 rounded-lg border bg-card p-6">
        <p className="text-sm">
          <span className="text-muted-foreground">Email:</span> {user.email}
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Rol:</span> {user.role}
        </p>
      </div>

      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </main>
  );
}
