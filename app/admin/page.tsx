import Link from 'next/link';
import { count, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, invitations, genetics, orders } from '@/lib/db/schema';

async function getCounts() {
  const [[active], [underReview], [pendingInv], [activeGenetics], [paidOrders]] = await Promise.all([
    db.select({ n: count() }).from(users).where(eq(users.status, 'active')),
    db.select({ n: count() }).from(users).where(eq(users.status, 'under_review')),
    db.select({ n: count() }).from(invitations).where(eq(invitations.status, 'pending')),
    db.select({ n: count() }).from(genetics).where(eq(genetics.active, true)),
    db.select({ n: count() }).from(orders).where(eq(orders.status, 'paid')),
  ]);

  return {
    activeMembers: active?.n ?? 0,
    underReview: underReview?.n ?? 0,
    pendingInvitations: pendingInv?.n ?? 0,
    activeGenetics: activeGenetics?.n ?? 0,
    paidOrders: paidOrders?.n ?? 0,
  };
}

const STATS: Array<{
  key: keyof Awaited<ReturnType<typeof getCounts>>;
  label: string;
  hint: string;
  href?: string;
}> = [
  { key: 'activeMembers', label: 'Socios activos', hint: 'con REPROCANN validado' },
  { key: 'underReview', label: 'En revisión', hint: 'esperando aprobación admin', href: '/admin/solicitudes' },
  { key: 'paidOrders', label: 'Pedidos por despachar', hint: 'pagados, esperando preparación', href: '/admin/pedidos?status=paid' },
  { key: 'pendingInvitations', label: 'Invitaciones abiertas', hint: 'sin canjear todavía', href: '/admin/invitations' },
  { key: 'activeGenetics', label: 'Genéticas activas', hint: 'disponibles para socios', href: '/admin/genetics' },
];

export default async function AdminIndexPage() {
  const c = await getCounts();
  const hasPending = c.underReview > 0;
  const hasPaidOrders = c.paidOrders > 0;

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Panel
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Resumen del <span className="text-brand">club</span>.
        </h1>
      </header>

      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">
          Estadísticas
        </h2>
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STATS.map((s) => {
            const value = c[s.key];
            const isAlert =
              (s.key === 'underReview' || s.key === 'paidOrders') && value > 0;
            const Inner = (
              <div
                className={`flex h-full flex-col gap-3 bg-card p-6 transition-colors ${s.href ? 'hover:bg-muted/40' : ''} ${
                  isAlert ? 'relative' : ''
                }`}
              >
                {isAlert && (
                  <span
                    className="absolute -right-2 -top-2 inline-flex h-3 w-3 rounded-full bg-brand"
                    style={{ boxShadow: '0 0 14px hsl(var(--brand))' }}
                    aria-hidden
                  />
                )}
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </span>
                <span className={`font-mono text-4xl tabular-nums ${isAlert ? 'text-brand' : ''}`}>
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{s.hint}</span>
              </div>
            );
            return (
              <li key={s.key}>
                {s.href ? <Link href={s.href}>{Inner}</Link> : Inner}
              </li>
            );
          })}
        </ul>
      </section>

      {(hasPending || hasPaidOrders) && (
        <div className="grid gap-6 md:grid-cols-2">
          {hasPending && (
            <section className="relative overflow-hidden border border-brand/40 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 shadow-[0_0_60px_-20px_hsl(var(--brand)/0.45)]">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-50"
                style={{
                  background: 'radial-gradient(circle, hsl(32 70% 50% / 0.5), transparent 70%)',
                  filter: 'blur(40px)',
                }}
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
                ◆ Solicitudes pendientes
              </p>
              <h3 className="mt-2 font-display text-xl font-medium uppercase tracking-[0.12em]">
                Hay {c.underReview}{' '}
                {c.underReview === 1 ? 'socio esperando' : 'socios esperando'} revisión.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Revisá los datos y el comprobante REPROCANN, después aprobá o rechazá.
              </p>
              <Link
                href="/admin/solicitudes"
                className="mt-5 inline-block border border-brand/60 bg-transparent px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-brand transition-colors hover:bg-brand/10"
              >
                Ver solicitudes →
              </Link>
            </section>
          )}

          {hasPaidOrders && (
            <section className="relative overflow-hidden border border-brand/40 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-6 shadow-[0_0_60px_-20px_hsl(var(--brand)/0.45)]">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-50"
                style={{
                  background: 'radial-gradient(circle, hsl(32 70% 50% / 0.5), transparent 70%)',
                  filter: 'blur(40px)',
                }}
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
                ◆ Pedidos por despachar
              </p>
              <h3 className="mt-2 font-display text-xl font-medium uppercase tracking-[0.12em]">
                {c.paidOrders} {c.paidOrders === 1 ? 'pedido pagado' : 'pedidos pagados'} esperando
                preparación.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Revisá items y datos del socio, prepará el pedido y marcalo "En tránsito".
              </p>
              <Link
                href="/admin/pedidos?status=paid"
                className="mt-5 inline-block border border-brand/60 bg-transparent px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-brand transition-colors hover:bg-brand/10"
              >
                Ver pedidos →
              </Link>
            </section>
          )}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/invitations"
          className="group border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">Invitaciones</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Generar acceso
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Código nominal de un solo uso para socios nuevos.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ir →
          </span>
        </Link>

        <Link
          href="/admin/solicitudes"
          className="group border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">Verificaciones</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Solicitudes
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Revisar permisos REPROCANN enviados por socios.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ir →
          </span>
        </Link>

        <Link
          href="/admin/pedidos"
          className="group border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">Operación</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Pedidos
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pagos confirmados, despachos pendientes, entregas.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ir →
          </span>
        </Link>

        <Link
          href="/admin/genetics"
          className="group border border-border bg-card p-6 transition-colors hover:border-brand/60"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">Catálogo</p>
          <h3 className="mt-3 font-display text-xl font-medium uppercase tracking-[0.12em]">
            Genéticas
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cargar, editar y publicar las genéticas del dispensario.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] text-brand transition-transform group-hover:translate-x-1">
            Ir →
          </span>
        </Link>
      </section>
    </div>
  );
}
