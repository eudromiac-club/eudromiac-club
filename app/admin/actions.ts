'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { invitations } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';

const CreateInvitationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ error: 'Email inválido.' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  daysValid: z.coerce.number().int().min(1).max(60).default(7),
});

export type CreateInvitationState =
  | { ok: true; code: string }
  | { ok: false; error: string }
  | undefined;

function newCode(): string {
  // 16 hex chars = 8 bytes, URL-safe, suficiente entropía para algo no-secreto-pero-no-adivinable.
  return randomBytes(8).toString('hex');
}

export async function createInvitationAction(
  _prev: CreateInvitationState,
  formData: FormData,
): Promise<CreateInvitationState> {
  const admin = await requireAdmin();

  const parsed = CreateInvitationSchema.safeParse({
    email: formData.get('email') ?? undefined,
    daysValid: formData.get('daysValid') ?? undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: z.flattenError(parsed.error).formErrors[0] ?? 'Datos inválidos.' };
  }

  const code = newCode();
  const expiresAt = new Date(Date.now() + parsed.data.daysValid * 24 * 60 * 60 * 1000);

  await db.insert(invitations).values({
    code,
    email: parsed.data.email,
    createdBy: admin.id,
    expiresAt,
  });

  revalidatePath('/admin/invitations');
  return { ok: true, code };
}

export async function revokeInvitationAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id');
  if (typeof id !== 'string' || id.length === 0) return;

  await db
    .update(invitations)
    .set({ status: 'revoked' })
    .where(and(eq(invitations.id, id), eq(invitations.status, 'pending')));

  revalidatePath('/admin/invitations');
}
