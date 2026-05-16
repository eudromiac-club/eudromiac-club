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
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        ← Volver a mi cuenta
      </Link>
      <h1 className="mt-6 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
        Mi permiso <span className="text-brand">REPROCANN</span>.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        El formulario completo (número, vencimiento, médico tratante, comprobante en PDF/imagen)
        se habilita en la próxima entrega. Por ahora, si tu cuenta sigue en revisión escribinos
        por el canal del club y te ayudamos manualmente.
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-8 rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:border-brand hover:bg-brand/10 hover:text-brand"
      >
        <Link href="/cuenta">Volver</Link>
      </Button>
    </main>
  );
}
