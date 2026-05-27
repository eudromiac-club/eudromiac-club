'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { users, patientProfiles, patientStatusHistory } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';
import { notifyReprocannApproved, notifyReprocannRejected } from '@/lib/email/notify';

const IdSchema = z.object({ userId: z.string().uuid() });
const RejectSchema = z.object({
  userId: z.string().uuid(),
  reason: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export async function approveReprocannAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = IdSchema.safeParse({ userId: formData.get('userId') });
  if (!parsed.success) return;

  const { userId } = parsed.data;

  const notify = await db.transaction(async (tx) => {
    const [u] = await tx
      .select({ status: users.status, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!u || u.status !== 'under_review') return null;

    await tx.update(users).set({ status: 'active', updatedAt: sql`now()` }).where(eq(users.id, userId));

    await tx
      .update(patientProfiles)
      .set({
        reprocannStatus: 'active',
        verifiedAt: sql`now()`,
        verifiedBy: admin.id,
        updatedAt: sql`now()`,
      })
      .where(eq(patientProfiles.userId, userId));

    await tx.insert(patientStatusHistory).values({
      userId,
      fromStatus: 'under_review',
      toStatus: 'active',
      reason: 'Aprobado por admin.',
      changedBy: admin.id,
    });

    return { email: u.email, name: u.name };
  });

  if (notify) await notifyReprocannApproved(notify.email, notify.name);

  revalidatePath('/admin');
  revalidatePath('/admin/solicitudes');
  revalidatePath('/admin/solicitudes/' + userId);
  redirect('/admin/solicitudes');
}

export async function rejectReprocannAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = RejectSchema.safeParse({
    userId: formData.get('userId'),
    reason: formData.get('reason'),
  });
  if (!parsed.success) return;

  const { userId, reason } = parsed.data;

  const notify = await db.transaction(async (tx) => {
    const [u] = await tx
      .select({ status: users.status, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!u || u.status !== 'under_review') return null;

    await tx.update(users).set({ status: 'rejected', updatedAt: sql`now()` }).where(eq(users.id, userId));

    await tx
      .update(patientProfiles)
      .set({
        reprocannStatus: 'rejected',
        updatedAt: sql`now()`,
      })
      .where(eq(patientProfiles.userId, userId));

    await tx.insert(patientStatusHistory).values({
      userId,
      fromStatus: 'under_review',
      toStatus: 'rejected',
      reason: reason ?? 'Rechazado por admin.',
      changedBy: admin.id,
    });

    return { email: u.email, name: u.name };
  });

  if (notify) await notifyReprocannRejected(notify.email, notify.name, reason);

  revalidatePath('/admin');
  revalidatePath('/admin/solicitudes');
  redirect('/admin/solicitudes');
}
