import Link from 'next/link';
import { count, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, invitations, genetics } from '@/lib/db/schema';

async function getCounts() {
  const [[active], [pendingKyc], [pendingInv], [activeGenetics]] = await Promise.all([
    db.select({ n: count() }).from(users).where(eq(users.status, 'active')),
    db.select({ n: count() }).from(users).where(eq(users.status, 'pending_kyc')),
    db.select({ n: count() }).from(invitations).where(eq(invitations.status, 'pending')),
    db.select({ n: count() }).from(genetics).where(eq(genetics.active, true)),
  ]);

  return {
    activeMembers: active?.n ?? 0,
    pendingKyc: pendingKyc?.n ?? 0,
    pendingInvitations: pendingInv?.n ?? 0,
    activeGenetics: activeGenetics?.n ?? 0,
  };
}

const STATS: Array<{ key: keyof Awaited<ReturnType<typeof getCounts>>; label: string; hint: string }> = [
  { key: 'activeMembers', label: 'Socios activos', hint: 'con REPROCANN validado' },
  { key: 'pendingKyc', label: 'Pendientes KYC', hint: 'esperando validación' },
  { key: 'pendingInvitations', label: 'Invitaciones abiertas', hint: 'sin canjear todavía' },
  { key: 'activeGenetics', label: 'Genéticas activas', hint: 'disponibles para socios' },
];

export default async function AdminIndexPage() {
  const c = await getCounts();

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Panel</p>
        <h1 className="mt-2 font-display text-4xl italic tracking-tight">Resumen del club.</h1>
      </header>

      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">
          Estadísticas
        </h2>
        <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <li
              key={s.key}
              className="flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-muted/40"
            >
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {s.label}
              </span>
              <span className="font-mono text-4xl tabular-nums">{c[s.key]}</span>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/invitations"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-foreground/30"
        >
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-brand">Invitaciones</p>
          <h3 className="mt-3 font-display text-2xl italic tracking-tight">Generar nuevo acceso</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crear un código de invitación y compartir el link con un socio nuevo.
          </p>
          <span className="mt-4 inline-block text-sm group-hover:underline">Ir →</span>
        </Link>

        <div className="rounded-xl border border-dashed bg-card/40 p-6 text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-[0.15em]">Próximamente</p>
          <p className="mt-3">
            Gestión de socios (REPROCANN), catálogo de genéticas, pedidos y reportes.
          </p>
        </div>
      </section>
    </div>
  );
}
