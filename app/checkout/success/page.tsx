import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pago aprobado · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">◆ Pago aprobado</p>
      <h1 className="mt-4 font-display text-4xl font-medium uppercase tracking-[0.1em]">
        Gracias por tu <span className="text-brand">pedido</span>.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Tu pago se procesó correctamente. El equipo del club lo despacha cuando esté listo y
        podrás seguir el estado desde tu cuenta.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
          <Link href={orderId ? `/cuenta/pedidos/${orderId}` : '/cuenta/pedidos'}>Ver mi pedido</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:bg-brand/10"
        >
          <Link href="/dispensario">Volver al dispensario</Link>
        </Button>
      </div>
    </main>
  );
}
