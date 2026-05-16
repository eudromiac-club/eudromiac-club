import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, patientProfiles, patientStatusHistory, orders } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { USER_STATUS_LABEL, USER_STATUS_COLOR } from '@/lib/users/status';
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  formatPriceArs,
  formatDate,
} from '@/lib/orders/labels';
import { changeMemberStatusAction } from '../actions';

export const metadata = {
  title: 'Socio · Admin · EUDROMIA CLUB',
};

const NEXT_ACTIONS: Record<
  string,
  Array<{ to: string; label: string; tone: 'brand' | 'neutral' | 'destructive' }>
> = {
  pending_kyc: [
    { to: 'suspended', label: 'Suspender', tone: 'destructive' },
  ],
  under_review: [
    { to: 'suspended', label: 'Suspender', tone: 'destructive' },
  ],
  active: [
    { to: 'suspended', label: 'Suspender', tone: 'destructive' },
    { to: 'inactive', label: 'Marcar inactivo', tone: 'neutral' },
  ],
  rejected: [
    { to: 'active', label: 'Reactivar', tone: 'brand' },
  ],
  suspended: [
    { to: 'active', label: 'Reactivar', tone: 'brand' },
    { to: 'inactive', label: 'Marcar inactivo', tone: 'neutral' },
  ],
  inactive: [
    { to: 'active', label: 'Reactivar', tone: 'brand' },
  ],
};

export default async function AdminSocioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      profile: patientProfiles,
    })
    .from(users)
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(eq(users.id, id))
    .limit(1);

  if (!row) notFound();
  if (row.role === 'admin') notFound();

  const history = await db
    .select()
    .from(patientStatusHistory)
    .where(eq(patientStatusHistory.userId, id))
    .orderBy(desc(patientStatusHistory.changedAt))
    .limit(20);

  const userOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalCents: orders.totalCents,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, id))
    .orderBy(desc(orders.createdAt))
    .limit(20);

  const p = row.profile;
  const actions = NEXT_ACTIONS[row.status] ?? [];

  return (
    <div className="space-y-10">
      <header>
        <Link
          href="/admin/socios"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Volver a socios
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-medium uppercase tracking-[0.1em] sm:text-3xl">
              {p?.fullName ?? row.name ?? row.email.split('@')[0]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{row.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Alta: {formatDate(row.createdAt)}</p>
          </div>
          <span
            className={`inline-flex rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.25em] ${
              USER_STATUS_COLOR[row.status] ?? 'border-border text-muted-foreground'
            }`}
          >
            {USER_STATUS_LABEL[row.status] ?? row.status}
          </span>
        </div>
      </header>

      {p ? (
        <section className="grid gap-6 md:grid-cols-2">
          <div className="border border-border bg-card p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
              ◆ Datos personales
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DNI</dt>
                <dd className="mt-0.5">{p.dni}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Fecha de nacimiento
                </dt>
                <dd className="mt-0.5">{formatDate(p.birthDate)}</dd>
              </div>
              {p.phone && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Teléfono</dt>
                  <dd className="mt-0.5">{p.phone}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border border-border bg-card p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
              ◆ Permiso REPROCANN
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Número</dt>
                <dd className="mt-0.5 font-mono">{p.reprocannNumber ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Vence</dt>
                <dd className="mt-0.5">{formatDate(p.reprocannExpiresAt)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Médico</dt>
                <dd className="mt-0.5">{p.doctorName ?? '—'}</dd>
              </div>
              {p.reprocannDocUrl && (
                <a
                  href={p.reprocannDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand hover:underline"
                >
                  Ver comprobante →
                </a>
              )}
            </dl>
          </div>
        </section>
      ) : (
        <section className="border border-dashed border-border p-6 text-sm text-muted-foreground">
          Este socio todavía no cargó su permiso REPROCANN.
        </section>
      )}

      <section className="border border-border bg-card">
        <h2 className="border-b border-border p-5 font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Pedidos ({userOrders.length})
        </h2>
        {userOrders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Sin pedidos.</p>
        ) : (
          <ul className="divide-y">
            {userOrders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/pedidos/${o.id}`}
                  className="flex flex-wrap items-center gap-4 p-4 text-sm transition-colors hover:bg-muted/40"
                >
                  <span
                    className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                      ORDER_STATUS_COLOR[o.status] ?? 'border-border text-muted-foreground'
                    }`}
                  >
                    {ORDER_STATUS_LABEL[o.status] ?? o.status}
                  </span>
                  <span className="font-mono text-xs">#{o.id.slice(0, 8)}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</span>
                  <span className="ml-auto font-mono text-sm text-brand">
                    {formatPriceArs(o.totalCents)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border border-border bg-card">
        <h2 className="border-b border-border p-5 font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Historial de estados
        </h2>
        {history.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Sin cambios registrados.</p>
        ) : (
          <ul className="divide-y">
            {history.map((h) => (
              <li key={h.id} className="p-4 text-sm">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {h.fromStatus ?? '—'}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-brand">
                    {USER_STATUS_LABEL[h.toStatus] ?? h.toStatus}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatDate(h.changedAt)}
                  </span>
                </p>
                {h.reason && <p className="mt-1 text-xs text-muted-foreground">{h.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {actions.length > 0 && (
        <section className="border border-brand/30 bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Acciones
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Las transiciones de aprobar/rechazar REPROCANN viven en{' '}
            <Link href="/admin/solicitudes" className="underline hover:text-foreground">
              Solicitudes
            </Link>
            . Acá solo cambios manuales (suspender, reactivar, marcar inactivo).
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {actions.map((a) => (
              <form key={a.to} action={changeMemberStatusAction} className="border border-border p-4">
                <input type="hidden" name="userId" value={row.id} />
                <input type="hidden" name="status" value={a.to} />
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {a.label}
                </p>
                <textarea
                  name="reason"
                  rows={2}
                  maxLength={500}
                  placeholder="Motivo (opcional)"
                  className="mt-3 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  variant={a.tone === 'brand' ? 'default' : 'outline'}
                  className={`mt-3 rounded-none px-5 py-3 text-[11px] uppercase tracking-[0.25em] ${
                    a.tone === 'destructive'
                      ? 'border-destructive/60 bg-transparent text-destructive hover:bg-destructive/10'
                      : a.tone === 'brand'
                        ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                        : 'border-border hover:border-foreground/40'
                  }`}
                >
                  {a.label}
                </Button>
              </form>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
