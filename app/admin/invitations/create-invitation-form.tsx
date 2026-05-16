'use client';

import { useActionState, useState } from 'react';
import { createInvitationAction, type CreateInvitationState } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateInvitationForm({ appUrl }: { appUrl: string }) {
  const [state, action, isPending] = useActionState<CreateInvitationState, FormData>(
    createInvitationAction,
    undefined,
  );
  const [copied, setCopied] = useState(false);

  const inviteUrl = state?.ok ? `${appUrl}/invitacion/${state.code}` : null;

  async function copyLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <Input name="email" type="email" placeholder="email opcional del invitado" autoComplete="off" />
        <Input
          name="daysValid"
          type="number"
          min={1}
          max={60}
          defaultValue={7}
          className="sm:w-24"
          aria-label="Días válidos"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Generando…' : 'Generar link'}
        </Button>
      </form>

      {state && !state.ok && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      {inviteUrl && (
        <div className="rounded-md border bg-muted/40 p-3">
          <p className="mb-2 text-xs text-muted-foreground">Compartí este link con el socio:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate text-sm">{inviteUrl}</code>
            <Button type="button" variant="outline" size="sm" onClick={copyLink}>
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
