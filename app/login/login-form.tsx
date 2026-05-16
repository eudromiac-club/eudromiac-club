'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const [state, action, isPending] = useActionState<LoginState, FormData>(loginAction, undefined);
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

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
        {errors?.password && <p className="text-sm text-destructive">{errors.password[0]}</p>}
      </div>

      {errors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
