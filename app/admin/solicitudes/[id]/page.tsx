import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, patientProfiles } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { approveReprocannAction, rejectReprocannAction } from '../actions';

export const metadata = {
  title: 'Solicitud · Admin · EUDROMIA CLUB',
};

function formatDate(d: string | Date | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export default async function AdminSolicitudPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      status: users.status,
      createdAt: users.createdAt,
      profile: patientProfiles,
    })
    .from(users)
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(eq(users.id, id))
    .limit(1);

  if (!row || !row.profile) notFound();
  const p = row.profile;

  const isPending = row.status === 'under_review';

  return (
    <div className="space-y-10">
      <header>
        <Link
          href="/admin/solicitudes"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Volver a solicitudes
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          {p.fullName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {row.email} · Estado actual: <span className="text-brand">{row.status}</span>
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Datos del titular
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
              <dd className="mt-0.5 font-mono">{p.reprocannNumber}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Vencimiento</dt>
              <dd className="mt-0.5">{formatDate(p.reprocannExpiresAt)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Médico</dt>
              <dd className="mt-0.5">
                {p.doctorName}
                {p.doctorLicense && ` · Mat. ${p.doctorLicense}`}
                {p.doctorProvince && ` · ${p.doctorProvince}`}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {p.reprocannDocUrl && (
        <section className="border border-brand/30 bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Comprobante adjunto
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href={p.reprocannDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-brand/60 bg-transparent px-5 py-3 text-[11px] uppercase tracking-[0.25em] text-brand transition-colors hover:bg-brand/10"
            >
              Abrir archivo →
            </a>
            <p className="text-xs text-muted-foreground">
              Se abre en una pestaña nueva. Revisalo antes de decidir.
            </p>
          </div>
        </section>
      )}

      {p.notes && (
        <section className="border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            ◆ Notas del socio
          </h2>
          <p className="mt-4 text-sm leading-relaxed">{p.notes}</p>
        </section>
      )}

      {isPending ? (
        <section className="grid gap-6 border border-border bg-card p-6 md:grid-cols-2">
          <form action={approveReprocannAction}>
            <input type="hidden" name="userId" value={row.userId} />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
              ◆ Aprobar
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              El socio pasa a <span className="text-foreground">activo</span> y puede comprar en
              el dispensario.
            </p>
            <Button
              type="submit"
              className="mt-5 rounded-none bg-brand px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand-foreground hover:bg-brand/90"
            >
              Aprobar solicitud
            </Button>
          </form>

          <form action={rejectReprocannAction} className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <input type="hidden" name="userId" value={row.userId} />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
              ◆ Rechazar
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              La cuenta queda como <span className="text-foreground">rechazada</span>, el socio
              pierde acceso. El motivo queda en el audit log.
            </p>
            <textarea
              name="reason"
              rows={2}
              maxLength={500}
              placeholder="Motivo (opcional)"
              className="mt-4 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              variant="outline"
              className="mt-3 rounded-none border-destructive/60 px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Rechazar
            </Button>
          </form>
        </section>
      ) : (
        <section className="border border-border bg-card p-6 text-sm text-muted-foreground">
          Esta solicitud ya no está pendiente (estado actual: {row.status}).
        </section>
      )}
    </div>
  );
}
