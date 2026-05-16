'use server';

import { z } from 'zod';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';

const LoginSchema = z.object({
  email: z.email({ error: 'Email inválido.' }).transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, { error: 'Ingresá tu contraseña.' }),
});

export type LoginState =
  | { ok: false; errors?: { email?: string[]; password?: string[]; form?: string[] } }
  | { ok: true }
  | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/cuenta',
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { ok: false, errors: { form: ['Email o contraseña incorrectos.'] } };
      }
      return { ok: false, errors: { form: ['No pudimos iniciar tu sesión. Probá de nuevo.'] } };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}
