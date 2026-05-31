export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Esperando pago',
  paid: 'Aprobado',
  shipped: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: 'border-border text-muted-foreground',
  paid: 'border-brand/60 text-brand',
  shipped: 'border-blue-500/60 text-blue-400',
  delivered: 'border-green-500/60 text-green-400',
  cancelled: 'border-destructive/50 text-destructive',
  refunded: 'border-muted-foreground/50 text-muted-foreground',
};

export const ORDER_STATUS_ORDER = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  mercadopago: 'MercadoPago',
  cash_on_delivery: 'Efectivo contra entrega',
};

export function formatPriceArs(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(d: Date | string | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
