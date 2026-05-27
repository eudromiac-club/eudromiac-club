import Link from 'next/link';
import { and, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, patientProfiles, orders } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { USER_STATUS_LABEL, USER_STATUS_COLOR, USER_STATUS_ORDER } from '@/lib/users/status';
import { formatPriceArs, formatDate } from '@/lib/orders/labels';

export const metadata = {
  title: 'Socios · Admin · EUDROMIA CLUB',
};

type SP = { status?: string; q?: string; flag?: string };

export default async function AdminSociosPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { status, q, flag } = await searchParams;
  const filterStatus = status && USER_STATUS_ORDER.includes(status as never) ? status : null;
  const search = q?.trim();
  const noReprocann = flag === 'no_reprocann';

  const conditions = [ne(users.role, 'admin')];
  if (filterStatus) conditions.push(eq(users.status, filterStatus as 'pending_kyc'));
  if (noReprocann) conditions.push(eq(patientProfiles.needsReprocannContact, true));
  if (search) {
    conditions.push(or(ilike(users.email, `%${search}%`), ilike(users.name, `%${search}%`))!);
  }

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      status: users.status,
      createdAt: users.createdAt,
      fullName: patientProfiles.fullName,
      reprocannNumber: patientProfiles.reprocannNumber,
      needsReprocannContact: patientProfiles.needsReprocannContact,
      ordersCount: sql<number>`(select coalesce(count(*), 0)::int from ${orders} where ${orders.userId} = ${users.id} and ${orders.status} in ('paid','shipped','delivered'))`,
      totalSpent: sql<number>`(select coalesce(sum(${orders.totalCents}), 0)::int from ${orders} where ${orders.userId} = ${users.id} and ${orders.status} in ('paid','shipped','delivered'))`,
    })
    .from(users)
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(users.createdAt))
    .limit(200);

  // Total de socios que declararon no tener REPROCANN (para el badge del chip).
  const [noReprocannAgg] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(and(ne(users.role, 'admin'), eq(patientProfiles.needsReprocannContact, true)));
  const noReprocannCount = noReprocannAgg?.count ?? 0;

  // Construye un href preservando los filtros activos, salvo los que se sobreescriban.
  const hrefWith = (overrides: { status?: string | null; q?: string | null; flag?: string | null }) => {
    const sp = new URLSearchParams();
    const nextStatus = 'status' in overrides ? overrides.status : filterStatus;
    const nextQ = 'q' in overrides ? overrides.q : search;
    const nextFlag = 'flag' in overrides ? overrides.flag : noReprocann ? 'no_reprocann' : null;
    if (nextStatus) sp.set('status', nextStatus);
    if (nextQ) sp.set('q', nextQ);
    if (nextFlag) sp.set('flag', nextFlag);
    const qs = sp.toString();
    return qs ? `/admin/socios?${qs}` : '/admin/socios';
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Admin · Comunidad
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          <span className="text-brand">Socios</span> del club.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Listado de todos los socios (no admins). Filtrá por estado o buscá por email/nombre.
          Desde acá podés suspender, reactivar o marcar como inactivo.
        </p>
      </header>

      <form className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={search ?? ''}
          placeholder="Buscar por email o nombre…"
          className="flex h-10 min-w-[260px] flex-1 max-w-md rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {filterStatus && <input type="hidden" name="status" value={filterStatus} />}
        {noReprocann && <input type="hidden" name="flag" value="no_reprocann" />}
        <Button type="submit" variant="outline" className="rounded-none text-[11px] uppercase tracking-[0.2em]">
          Buscar
        </Button>
        {search && (
          <Link
            href={hrefWith({ q: null })}
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </Link>
        )}
      </form>

      <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
        <Link
          href={hrefWith({ status: null })}
          className={`border px-3 py-1.5 transition-colors ${
            !filterStatus
              ? 'border-brand bg-brand/10 text-brand'
              : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
          }`}
        >
          Todos
        </Link>
        {USER_STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={hrefWith({ status: s })}
            className={`border px-3 py-1.5 transition-colors ${
              filterStatus === s
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            {USER_STATUS_LABEL[s]}
          </Link>
        ))}

        <span aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:inline-block" />

        <Link
          href={hrefWith({ flag: noReprocann ? null : 'no_reprocann' })}
          className={`inline-flex items-center gap-2 border px-3 py-1.5 transition-colors ${
            noReprocann
              ? 'border-yellow-500/70 bg-yellow-500/10 text-yellow-500'
              : 'border-border text-muted-foreground hover:border-yellow-500/50 hover:text-yellow-500'
          }`}
        >
          Sin REPROCANN
          {noReprocannCount > 0 && (
            <span className="rounded-full bg-yellow-500/20 px-1.5 py-0.5 font-mono text-[10px] leading-none text-yellow-500">
              {noReprocannCount}
            </span>
          )}
        </Link>
      </nav>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No hay socios con ese filtro.</p>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/socios/${r.id}`}
                className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-muted/40"
              >
                <span
                  className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                    USER_STATUS_COLOR[r.status] ?? 'border-border text-muted-foreground'
                  }`}
                >
                  {USER_STATUS_LABEL[r.status] ?? r.status}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-medium uppercase tracking-[0.12em]">
                    {r.fullName ?? r.name ?? r.email.split('@')[0]}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.email}</p>
                  {r.needsReprocannContact && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-yellow-500/50 bg-yellow-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-yellow-500">
                      ● Sin REPROCANN · contactar
                    </span>
                  )}
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    REPROCANN
                  </p>
                  <p className="mt-0.5 font-mono">{r.reprocannNumber ?? '—'}</p>
                </div>

                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Pedidos
                  </p>
                  <p className="mt-0.5 font-mono">{r.ordersCount}</p>
                </div>

                <div className="text-right text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Total gastado
                  </p>
                  <p className="mt-0.5 font-mono text-brand">{formatPriceArs(r.totalSpent)}</p>
                </div>

                <div className="text-right text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Alta
                  </p>
                  <p className="mt-0.5">{formatDate(r.createdAt)}</p>
                </div>

                <span className="text-[11px] uppercase tracking-[0.2em] text-brand">Ver →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
