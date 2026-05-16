'use client';

import { useActionState } from 'react';
import { redeemInvitationAction, type RedeemState } from '@/app/actions/invitation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RedeemForm({ code, suggestedEmail }: { code: string; suggestedEmail: string }) {
  const [state, action, isPending] = useActionState<RedeemState, FormData>(
    redeemInvitationAction,
    undefined,
  );
  const errors = state && !state.ok ? state.errors : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="code" value={code} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={suggestedEmail}
          readOnly={suggestedEmail.length > 0}
        />
        {errors?.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre completo
        </label>
        <Input id="name" name="name" type="text" autoComplete="name" required />
        {errors?.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
        {errors?.password && <p className="text-sm text-destructive">{errors.password[0]}</p>}
      </div>

      {errors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Creando tu cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
