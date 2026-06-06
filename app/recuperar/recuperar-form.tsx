'use client';

import { useActionState } from 'react';
import { requestResetAction, type RequestResetState } from '@/app/actions/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RecuperarForm() {
  const [state, action, isPending] = useActionState<RequestResetState, FormData>(
    requestResetAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="rounded-md border border-brand/30 bg-brand/5 p-5 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Revisá tu email.</p>
        <p className="mt-2">
          Si existe una cuenta con ese email, te enviamos un link para restablecer tu contraseña.
          El link vence en 1 hora. Mirá también la carpeta de spam.
        </p>
      </div>
    );
  }

  const errors = state && !state.ok ? state.errors : undefined;

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {errors?.email && <p className="text-sm text-destructive">{errors.email[0]}</p>}
      </div>

      {errors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Enviando…' : 'Enviarme el link'}
      </Button>
    </form>
  );
}
