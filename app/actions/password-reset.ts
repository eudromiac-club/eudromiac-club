'use server';

import { z } from 'zod';

import { createPasswordResetToken, resetPasswordWithToken } from '@/lib/auth/password-reset';
import { notifyPasswordReset } from '@/lib/email/notify';
import { emailConfigured } from '@/lib/email/client';

function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/+$/, '');
}

// ---------------------------------------------------------------------------
// Paso 1 — pedir el link (form de email en /recuperar)
// ---------------------------------------------------------------------------

const RequestSchema = z.object({
  email: z.email({ error: 'Email inválido.' }).transform((v) => v.trim().toLowerCase()),
});

export type RequestResetState =
  | undefined
  | { ok: true }
  | { ok: false; errors?: { email?: string[]; form?: string[] } };

export async function requestResetAction(
  _prev: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const parsed = RequestSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const result = await createPasswordResetToken(parsed.data.email);
    if (result) {
      const url = `${appUrl()}/recuperar/${result.token}`;
      if (emailConfigured()) {
        await notifyPasswordReset(result.user.email, result.user.name, url);
      } else {
        // Sin Resend configurado no se manda el email; dejamos el link en los
        // logs del server para poder probar el flujo en dev.
        console.info('[password-reset] Resend ausente — link para', result.user.email, ':', url);
      }
    }
  } catch (e) {
    // No revelamos nada al cliente si algo falla (evita filtrar si el email existe).
    console.error('[password-reset] error generando token:', e);
  }

  // SIEMPRE devolvemos ok: no revelamos si existe o no una cuenta con ese email.
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Paso 2 — elegir contraseña nueva (form en /recuperar/[token])
// ---------------------------------------------------------------------------

const ResetSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, { error: 'La contraseña tiene que tener al menos 8 caracteres.' })
      .max(200),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    error: 'Las contraseñas no coinciden.',
  });

export type ResetPasswordState =
  | undefined
  | { ok: true }
  | { ok: false; errors?: { password?: string[]; confirm?: string[]; form?: string[] } };

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = ResetSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return { ok: false, errors: fieldErrors };
  }

  const done = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
  if (!done) {
    return {
      ok: false,
      errors: { form: ['El link no es válido o ya venció. Pedí uno nuevo desde "Olvidé mi contraseña".'] },
    };
  }

  return { ok: true };
}
