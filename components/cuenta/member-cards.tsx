import Link from 'next/link';
import type { Loyalty, NextShipment } from '@/lib/loyalty/server';
import { carrierLabel, trackingUrl } from '@/lib/orders/carriers';

// Tarjeta de fidelidad: nivel + puntos + progreso al próximo nivel.
export function LoyaltyCard({ loyalty }: { loyalty: Loyalty }) {
  const { points, tier, next } = loyalty;
  return (
    <section
      aria-labelledby="loyalty-title"
      className="relative overflow-hidden border border-brand/40 bg-gradient-to-br from-[hsl(42_30%_10%)] via-card to-[hsl(38_22%_8%)] p-6 shadow-[0_0_60px_-22px_hsl(var(--brand)/0.5)]"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, hsl(42 75% 52% / 0.5), transparent 70%)',
          filter: 'blur(46px)',
        }}
        aria-hidden
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Programa de socios
          </p>
          <h2 id="loyalty-title" className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em]">
            Nivel <span className="text-brand">{tier.label}</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Puntos
          </p>
          <p className="font-display text-4xl text-brand tabular-nums">
            {points.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {next ? (
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${next.progressPct}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Te faltan <span className="text-foreground">{next.pointsToGo.toLocaleString('es-AR')}</span>{' '}
            puntos para alcanzar <span className="text-brand">Nivel {next.label}</span>.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-xs text-muted-foreground">
          Llegaste al nivel máximo. Gracias por ser parte del club. ✦
        </p>
      )}
    </section>
  );
}

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
