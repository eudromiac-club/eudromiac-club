'use server';

import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

import { db } from '@/lib/db';
import { invitations, users } from '@/lib/db/schema';
import { signIn } from '@/auth';

const RedeemSchema = z.object({
  code: z.string().min(1),
  email: z.email({ error: 'Email inválido.' }).transform((v) => v.trim().toLowerCase()),
  name: z.string().trim().min(1, { error: 'Ingresá tu nombre.' }).max(120),
  password: z
    .string()
    .min(8, { error: 'La contraseña tiene que tener al menos 8 caracteres.' })
    .max(200),
});

export type RedeemState =
  | { ok: false; errors?: { email?: string[]; name?: string[]; password?: string[]; form?: string[] } }
  | { ok: true }
  | undefined;

export async function redeemInvitationAction(
  _prev: RedeemState,
  formData: FormData,
): Promise<RedeemState> {
  const parsed = RedeemSchema.safeParse({
    code: formData.get('code'),
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { code, email, name, password } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      const [inv] = await tx
        .select()
        .from(invitations)
        .where(eq(invitations.code, code))
        .for('update')
        .limit(1);

      if (!inv) throw new RedeemError('Esta invitación no existe.');
      if (inv.status === 'redeemed') throw new RedeemError('Esta invitación ya fue canjeada.');
      if (inv.status === 'revoked') throw new RedeemError('Esta invitación fue revocada.');
      if (inv.status === 'expired' || inv.expiresAt.getTime() < Date.now()) {
        throw new RedeemError('Esta invitación expiró.');
      }
      if (inv.email && inv.email.toLowerCase() !== email) {
        throw new RedeemError('La invitación fue emitida para otro email.');
      }

      const [existing] = await tx.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing) throw new RedeemError('Ya existe una cuenta con ese email.');

      const passwordHash = await bcrypt.hash(password, 10);

      const [created] = await tx
        .insert(users)
        .values({
          email,
          name,
          passwordHash,
          role: 'member',
          status: 'pending_kyc',
        })
        .returning({ id: users.id });

      await tx
        .update(invitations)
        .set({ status: 'redeemed', redeemedBy: created.id, redeemedAt: sql`now()` })
        .where(eq(invitations.id, inv.id));
    });
  } catch (e) {
    if (e instanceof RedeemError) {
      return { ok: false, errors: { form: [e.message] } };
    }
    console.error('[redeem] error inesperado:', e);
    return { ok: false, errors: { form: ['No pudimos crear tu cuenta. Probá de nuevo en un rato.'] } };
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/cuenta' });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, errors: { form: ['Cuenta creada, pero no pudimos iniciar tu sesión. Probá entrar desde /login.'] } };
    }
    throw error;
  }
}

class RedeemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RedeemError';
  }
}
