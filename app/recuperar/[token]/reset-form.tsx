'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetPasswordAction, type ResetPasswordState } from '@/app/actions/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ResetForm({ token }: { token: string }) {
  const [state, action, isPending] = useActionState<ResetPasswordState, FormData>(
    resetPasswordAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="space-y-5">
        <div className="rounded-md border border-brand/30 bg-brand/5 p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Listo.</p>
          <p className="mt-2">Tu contraseña fue cambiada. Ya podés ingresar con la nueva.</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Ir a ingresar</Link>
        </Button>
      </div>
    );
  }

  const errors = state && !state.ok ? state.errors : undefined;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Nueva contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {errors?.password && <p className="text-sm text-destructive">{errors.password[0]}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm" className="text-sm font-medium">
          Repetir contraseña
        </label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {errors?.confirm && <p className="text-sm text-destructive">{errors.confirm[0]}</p>}
      </div>

      {errors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}
