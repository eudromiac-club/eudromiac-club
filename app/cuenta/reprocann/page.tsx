import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/dal';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Mi permiso REPROCANN · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function ReprocannPage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/cuenta"
        className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
      >
        ← Volver a mi cuenta
      </Link>
      <h1 className="mt-6 font-display text-4xl italic tracking-tight">Mi permiso REPROCANN.</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        El formulario completo (número, vencimiento, médico tratante, comprobante en PDF/imagen) se
        habilita en la próxima entrega. Por ahora, si tu cuenta sigue en revisión escribinos por el
        canal del club y te ayudamos manualmente.
      </p>
      <Button asChild variant="outline" className="mt-8 rounded-full">
        <Link href="/cuenta">Volver</Link>
      </Button>
    </main>
  );
}
