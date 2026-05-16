import type { Metadata } from 'next';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { invitations } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { RedeemForm } from './redeem-form';

export const metadata: Metadata = {
  title: 'Canjear invitación · eudromiac club',
  robots: { index: false, follow: false },
};

type Reason = 'not_found' | 'redeemed' | 'revoked' | 'expired';

const reasonMessage: Record<Reason, string> = {
  not_found: 'Este link no corresponde a ninguna invitación.',
  redeemed: 'Esta invitación ya fue canjeada. Si la cuenta es tuya, ingresá desde /login.',
  revoked: 'Esta invitación fue revocada por el club.',
  expired: 'Esta invitación expiró. Pedile una nueva al socio que te invitó.',
};

async function loadInvitation(code: string) {
  const [inv] = await db.select().from(invitations).where(eq(invitations.code, code)).limit(1);
  if (!inv) return { ok: false as const, reason: 'not_found' as Reason };
  if (inv.status === 'redeemed') return { ok: false as const, reason: 'redeemed' as Reason };
  if (inv.status === 'revoked') return { ok: false as const, reason: 'revoked' as Reason };
  if (inv.status === 'expired' || inv.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, reason: 'expired' as Reason };
  }
  return { ok: true as const, invitation: inv };
}

export default async function RedeemInvitationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await loadInvitation(code);

  if (!result.ok) {
    return (
      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-destructive">
          Invitación no válida
        </p>
        <h1 className="mt-3 font-display text-4xl italic leading-tight tracking-tight">
          No podemos abrir este link.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">{reasonMessage[result.reason]}</p>
        <Button asChild variant="outline" className="mt-8 w-fit rounded-full px-5">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
        Invitación válida
      </p>
      <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">
        Crear tu cuenta.
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Bienvenido al club. Completá estos datos y desde tu panel cargás el permiso REPROCANN para
        validar.
      </p>
      <div className="mt-10">
        <RedeemForm code={code} suggestedEmail={result.invitation.email ?? ''} />
      </div>
    </main>
  );
}
