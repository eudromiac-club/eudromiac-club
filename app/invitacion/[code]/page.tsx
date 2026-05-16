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
  expired: 'Esta invitación expiró. Pedí una nueva al club.',
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
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-6 px-6 py-16">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Invitación no válida</h1>
        <p className="text-balance text-muted-foreground">{reasonMessage[result.reason]}</p>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver
        </Link>
      </div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Crear tu cuenta</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Bienvenido al club. Completá estos datos y después validamos tu permiso REPROCANN desde tu
        panel.
      </p>
      <RedeemForm code={code} suggestedEmail={result.invitation.email ?? ''} />
    </main>
  );
}
