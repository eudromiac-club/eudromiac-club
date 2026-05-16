import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/dal';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Cargar permiso REPROCANN · eudromiac club',
  robots: { index: false, follow: false },
};

export default async function ReprocannPage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link href="/cuenta" className="text-sm text-muted-foreground hover:text-foreground">
        ← Volver
      </Link>
      <h1 className="mt-4 mb-2 text-3xl font-semibold tracking-tight">Cargar permiso REPROCANN</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        El formulario completo (número, vencimiento, médico, comprobante) llega en la próxima fase.
        Por ahora escribinos por el canal del club si tu cuenta sigue en revisión.
      </p>
      <Button asChild variant="outline">
        <Link href="/cuenta">Volver a tu cuenta</Link>
      </Button>
    </main>
  );
}
