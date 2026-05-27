import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';

export const metadata = {
  title: 'Pedido confirmado · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const user = await requireUser();
  const { orderId } = await searchParams;

  let orderNumber: string | null = null;
  let isFree = false;
  let shipTo: string | null = null;
  if (orderId) {
    const [o] = await db
      .select({
        orderNumber: orders.orderNumber,
        totalCents: orders.totalCents,
        userId: orders.userId,
        shippingAddress: orders.shippingAddress,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (o && (o.userId === user.id || user.role === 'admin')) {
      orderNumber = o.orderNumber;
      isFree = o.totalCents === 0;
      if (o.shippingAddress) {
        shipTo = `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.province}`;
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
        ◆ {isFree ? 'Pedido confirmado' : 'Pago aprobado'}
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium uppercase tracking-[0.1em]">
        Gracias por tu <span className="text-brand">pedido</span>.
      </h1>

      {orderNumber && (
        <div className="mt-8 border border-brand/40 bg-card p-5 shadow-[0_0_40px_-20px_hsl(var(--brand))]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tu número de pedido
          </p>
          <p className="mt-2 font-mono text-2xl tracking-[0.25em] text-brand">{orderNumber}</p>
        </div>
      )}

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {isFree
          ? 'El equipo del club ya lo recibió y se pone con la preparación. Vas a poder seguir el estado desde tu cuenta.'
          : 'Tu pago se procesó correctamente. El equipo del club lo despacha cuando esté listo y vas a poder seguir el estado desde tu cuenta.'}
      </p>

      {shipTo && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          Lo enviamos a: <span className="text-brand">{shipTo}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]">
          <Link href={orderId ? `/cuenta/pedidos/${orderId}` : '/cuenta/pedidos'}>
            Ver mi pedido
          </Link>
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
