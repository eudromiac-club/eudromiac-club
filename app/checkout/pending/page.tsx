import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pago pendiente · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; reason?: string }>;
}) {
  const { orderId, reason } = await searchParams;
  const isMisconfig = reason === 'mp_not_configured';

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">◆ Pago pendiente</p>
      <h1 className="mt-4 font-display text-4xl font-medium uppercase tracking-[0.1em]">
        {isMisconfig ? (
          <>
            Configurá <span className="text-brand">MercadoPago</span>.
          </>
        ) : (
          <>
            Tu pago está <span className="text-brand">pendiente</span>.
          </>
        )}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {isMisconfig
          ? 'El pedido se creó pero MercadoPago todavía no está conectado. El admin tiene que setear MP_ACCESS_TOKEN en Vercel.'
          : 'Tu operación está pendiente de acreditación (cupón Rapipago/Pagofácil, transferencia, etc.). Te avisamos cuando se confirme.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
          <Link href={orderId ? `/cuenta/pedidos/${orderId}` : '/cuenta/pedidos'}>Ver mi pedido</Link>
        </Button>
      </div>
    </main>
  );
}
