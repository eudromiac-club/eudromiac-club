import Link from 'next/link';
import type { NextShipment } from '@/lib/orders/next-shipment';
import { carrierLabel, trackingUrl } from '@/lib/orders/carriers';

// Tarjeta "Tu próximo envío": pedido en curso (pagado o en camino).
export function NextShipmentCard({ shipment }: { shipment: NonNullable<NextShipment> }) {
  const inTransit = shipment.status === 'shipped';
  const url = inTransit ? trackingUrl(shipment.trackingCarrier, shipment.trackingNumber) : null;
  const carrier = carrierLabel(shipment.trackingCarrier);

  return (
    <section
      aria-labelledby="next-shipment-title"
      className="relative overflow-hidden border border-border bg-card p-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Tu próximo envío
      </p>
      <h2 id="next-shipment-title" className="mt-2 font-display text-2xl font-medium uppercase tracking-[0.1em]">
        {inTransit ? (
          <span className="text-brand">En camino</span>
        ) : (
          <>Preparando tu <span className="text-brand">pedido</span></>
        )}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {shipment.orderNumber ? `Pedido ${shipment.orderNumber}` : 'Tu pedido'}
        {inTransit && carrier ? ` · ${carrier}` : ''}
        {inTransit ? ' va en camino a tu domicilio.' : ' está siendo preparado para el envío.'}
      </p>

      <div className="mt-5 flex flex-wrap gap-4">
        <Link
          href={`/cuenta/pedidos/${shipment.id}`}
          className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform hover:translate-x-1"
        >
          Ver detalle →
        </Link>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Seguir envío ↗
          </a>
        )}
      </div>
    </section>
  );
}
