import type { Metadata } from 'next';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { patientProfiles } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { ReprocannForm } from './reprocann-form';

export const metadata: Metadata = {
  title: 'Mi permiso REPROCANN · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

function formatDate(d: string | Date | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export default async function ReprocannPage() {
  const user = await requireUser();
  const [profile] = await db
    .select()
    .from(patientProfiles)
    .where(eq(patientProfiles.userId, user.id))
    .limit(1);

  const BackLink = () => (
    <Link
      href="/cuenta"
      className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
    >
      ← Volver a mi cuenta
    </Link>
  );

  // Bloqueado total
  if (user.status === 'suspended' || user.status === 'inactive') {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <BackLink />
        <h1 className="mt-6 font-display text-3xl font-medium uppercase tracking-[0.1em]">
          Cuenta bloqueada.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Contactá al club para más información.
        </p>
      </main>
    );
  }

  // Esperando revisión del admin
  if (user.status === 'under_review') {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <BackLink />
        <section className="relative mt-8 overflow-hidden border border-brand/30 bg-gradient-to-br from-[hsl(32_25%_10%)] via-card to-[hsl(28_20%_8%)] p-8 shadow-[0_0_60px_-20px_hsl(var(--brand)/0.4)]">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-50"
            style={{
              background: 'radial-gradient(circle, hsl(42 70% 50% / 0.45), transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            ◆ Solicitud en revisión
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.1em]">
            Tu permiso está siendo <span className="text-brand">revisado</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Ya tenemos tu documentación. El equipo revisa cada solicitud uno a uno y te
            confirmamos cuando esté lista.
          </p>
          {profile && (
            <dl className="mt-6 grid gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-mono uppercase tracking-widest text-muted-foreground">Permiso</dt>
                <dd className="mt-1">{profile.reprocannNumber}</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-widest text-muted-foreground">Vence</dt>
                <dd className="mt-1">{formatDate(profile.reprocannExpiresAt)}</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-widest text-muted-foreground">Médico</dt>
                <dd className="mt-1">{profile.doctorName}</dd>
              </div>
              {profile.reprocannDocUrl && (
                <div>
                  <dt className="font-mono uppercase tracking-widest text-muted-foreground">Comprobante</dt>
                  <dd className="mt-1">
                    <a
                      href={profile.reprocannDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline hover:text-foreground"
                    >
                      Ver archivo
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </section>
        <Button asChild variant="outline" className="mt-8 rounded-none border-brand/60 bg-transparent px-6 py-5 text-[11px] uppercase tracking-[0.25em] text-brand hover:bg-brand/10">
          <Link href="/cuenta">Volver</Link>
        </Button>
      </main>
    );
  }

  // Aprobado
  if (user.status === 'active' && profile) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <BackLink />
        <h1 className="mt-6 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Permiso <span className="text-brand">verificado</span>.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tu solicitud fue aprobada el {formatDate(profile.verifiedAt)}.
        </p>
        <dl className="mt-8 grid gap-4 border border-border bg-card p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nombre</dt>
            <dd className="mt-1">{profile.fullName}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DNI</dt>
            <dd className="mt-1">{profile.dni}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Permiso</dt>
            <dd className="mt-1">{profile.reprocannNumber}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Vence</dt>
            <dd className="mt-1">{formatDate(profile.reprocannExpiresAt)}</dd>
          </div>
        </dl>
      </main>
    );
  }

  // Rechazado — puede reintentar
  const isRejected = user.status === 'rejected';

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <BackLink />
      <h1 className="mt-6 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
        Cargar mi <span className="text-brand">permiso REPROCANN</span>.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Completá los datos del titular, los del permiso y subí el comprobante (PDF o imagen
        legible). El equipo revisa cada solicitud uno a uno.
      </p>

      {isRejected && (
        <section className="mt-8 border border-destructive/40 bg-destructive/10 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-destructive">
            ◆ Solicitud rechazada
          </p>
          <p className="mt-2 text-sm">
            Tu solicitud anterior fue rechazada. Podés revisar los datos y volver a enviarla. Si
            necesitás ayuda, contactá al club.
          </p>
        </section>
      )}

      <div className="mt-10">
        <ReprocannForm
          defaults={
            profile
              ? {
                  fullName: profile.fullName,
                  dni: profile.dni,
                  birthDate: profile.birthDate,
                  phone: profile.phone,
                  reprocannNumber: profile.reprocannNumber,
                  reprocannExpiresAt: profile.reprocannExpiresAt,
                  doctorName: profile.doctorName,
                  doctorLicense: profile.doctorLicense,
                  doctorProvince: profile.doctorProvince,
                  notes: profile.notes,
                }
              : undefined
          }
        />
      </div>
    </main>
  );
}
