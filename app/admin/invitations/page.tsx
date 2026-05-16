import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { invitations } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { revokeInvitationAction } from '../actions';
import { CreateInvitationForm } from './create-invitation-form';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-brand-muted text-brand-foreground dark:text-brand',
  redeemed: 'bg-muted text-foreground',
  expired: 'bg-muted/60 text-muted-foreground',
  revoked: 'bg-destructive/10 text-destructive',
};

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  redeemed: 'Canjeada',
  expired: 'Expirada',
  revoked: 'Revocada',
};

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(d);
}

export default async function AdminInvitationsPage() {
  const rows = await db.select().from(invitations).orderBy(desc(invitations.createdAt)).limit(100);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Admin · Invitaciones
        </p>
        <h1 className="mt-2 font-display text-4xl italic tracking-tight">Acceso por invitación.</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Generá un código, copiá el link y mandaselo al socio nuevo por el canal que prefieras. El
          envío automático por email llega cuando enchufemos Resend.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-6 sm:p-8">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Nueva invitación
        </h2>
        <div className="mt-4">
          <CreateInvitationForm appUrl={appUrl} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Historial · últimas {rows.length}
        </h2>
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            Todavía no hay invitaciones.
          </p>
        ) : (
          <ul className="divide-y rounded-xl border bg-card">
            {rows.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center gap-4 px-5 py-4 text-sm"
              >
                <span
                  className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[inv.status] ?? ''
                  }`}
                >
                  {statusLabel[inv.status]}
                </span>
                <code className="font-mono text-xs tracking-tight">{inv.code}</code>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {inv.email ?? '— sin email —'}
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatDate(inv.createdAt)} → {formatDate(inv.expiresAt)}
                  {inv.redeemedAt && ` · ${formatDate(inv.redeemedAt)}`}
                </span>
                {inv.status === 'pending' && (
                  <form action={revokeInvitationAction}>
                    <input type="hidden" name="id" value={inv.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                      Revocar
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
