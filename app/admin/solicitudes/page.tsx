import Link from 'next/link';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, patientProfiles } from '@/lib/db/schema';

export const metadata = {
  title: 'Solicitudes pendientes · Admin · EUDROMIA CLUB',
};

function formatDate(d: string | Date | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export default async function AdminSolicitudesPage() {
  const rows = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      fullName: patientProfiles.fullName,
      dni: patientProfiles.dni,
      reprocannNumber: patientProfiles.reprocannNumber,
      reprocannExpiresAt: patientProfiles.reprocannExpiresAt,
      submittedAt: patientProfiles.updatedAt,
    })
    .from(users)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(eq(users.status, 'under_review'))
    .orderBy(desc(patientProfiles.updatedAt));

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Admin · Verificaciones
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Solicitudes <span className="text-brand">pendientes</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Socios que enviaron su documentación REPROCANN y esperan validación. Click en cada uno
          para ver los datos completos y el comprobante.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <ul className="divide-y border border-border bg-card">
          {rows.map((r) => (
            <li key={r.userId}>
              <Link
                href={`/admin/solicitudes/${r.userId}`}
                className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-medium uppercase tracking-[0.1em]">
                    {r.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.email} · DNI {r.dni}
                  </p>
                </div>
                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Permiso
                  </p>
                  <p className="mt-0.5 font-mono">{r.reprocannNumber}</p>
                </div>
                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Vence
                  </p>
                  <p className="mt-0.5">{formatDate(r.reprocannExpiresAt)}</p>
                </div>
                <div className="text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Enviada
                  </p>
                  <p className="mt-0.5">{formatDate(r.submittedAt)}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-brand">Revisar →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
