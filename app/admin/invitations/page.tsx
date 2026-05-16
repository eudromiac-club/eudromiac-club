import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { invitations } from '@/lib/db/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { revokeInvitationAction } from '../actions';
import { CreateInvitationForm } from './create-invitation-form';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  redeemed: 'secondary',
  expired: 'outline',
  revoked: 'destructive',
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
    year: 'numeric',
  }).format(d);
}

export default async function AdminInvitationsPage() {
  const rows = await db.select().from(invitations).orderBy(desc(invitations.createdAt)).limit(100);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Invitaciones</h1>
        <p className="text-sm text-muted-foreground">
          Generá un código y compartí el link con el socio. Sin Resend por ahora — el envío es manual.
        </p>
      </div>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold">Nueva invitación</h2>
        <CreateInvitationForm appUrl={appUrl} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Historial</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay invitaciones.</p>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {rows.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[inv.status]}>{statusLabel[inv.status]}</Badge>
                    <code className="text-xs">{inv.code}</code>
                    {inv.email && <span className="text-sm text-muted-foreground">· {inv.email}</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Creada {formatDate(inv.createdAt)} · Vence {formatDate(inv.expiresAt)}
                    {inv.redeemedAt && ` · Canjeada ${formatDate(inv.redeemedAt)}`}
                  </p>
                </div>
                {inv.status === 'pending' && (
                  <form action={revokeInvitationAction}>
                    <input type="hidden" name="id" value={inv.id} />
                    <Button type="submit" variant="outline" size="sm">
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
