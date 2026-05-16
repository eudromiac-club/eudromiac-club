import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pago rechazado · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
        ◆ Pago rechazado
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium uppercase tracking-[0.1em]">
        No pudimos procesar tu <span className="text-destructive">pago</span>.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {reason === 'mp_error'
          ? 'Hubo un error técnico al iniciar el pago. Probá de nuevo en un rato.'
          : 'MercadoPago rechazó la operación. Podés volver a intentar con otro medio de pago.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
          <Link href="/carrito">Volver al carrito</Link>
        </Button>
      </div>
    </main>
  );
}
