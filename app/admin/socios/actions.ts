'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { users, patientStatusHistory, patientProfiles } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';

// Acciones que el admin puede aplicar manualmente desde el panel de socios.
// Aprobar/rechazar viven en /admin/solicitudes (flow REPROCANN). Acá son
// las transiciones manuales.
const TARGET_STATUS = z.enum(['active', 'suspended', 'inactive']);

const ChangeSchema = z.object({
  userId: z.string().uuid(),
  status: TARGET_STATUS,
  reason: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export async function changeMemberStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const parsed = ChangeSchema.safeParse({
    userId: formData.get('userId'),
    status: formData.get('status'),
    reason: formData.get('reason'),
  });
  if (!parsed.success) return;

  const { userId, status, reason } = parsed.data;

  // No permitir modificar al propio admin (evitar lockout).
  if (userId === admin.id) return;

  await db.transaction(async (tx) => {
    const [u] = await tx
      .select({ status: users.status, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!u) return;
    // No tocar otros admins desde este panel.
    if (u.role === 'admin') return;
    if (u.status === status) return;

    await tx.update(users).set({ status, updatedAt: sql`now()` }).where(eq(users.id, userId));

    await tx.insert(patientStatusHistory).values({
      userId,
      fromStatus: u.status,
      toStatus: status,
      reason: reason ?? `Cambio manual desde panel de socios.`,
      changedBy: admin.id,
    });
  });

  revalidatePath('/admin/socios');
  revalidatePath('/admin/socios/' + userId);
  revalidatePath('/admin');
}

const MonthlyLimitSchema = z.object({
  userId: z.string().uuid(),
  monthlyGramsLimit: z
    .union([
      z.coerce.number().min(0).max(9999.99),
      z.literal('').transform(() => null),
    ])
    .nullable()
    .optional(),
});

export async function updateMonthlyLimitAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = MonthlyLimitSchema.safeParse({
    userId: formData.get('userId'),
    monthlyGramsLimit: formData.get('monthlyGramsLimit'),
  });
  if (!parsed.success) return;

  const { userId, monthlyGramsLimit } = parsed.data;
  const value = monthlyGramsLimit != null ? String(monthlyGramsLimit) : null;

  // Solo updateamos si ya existe el patient_profile. Si no existe, no
  // tiene sentido setearle un cap a un usuario sin REPROCANN cargado.
  await db
    .update(patientProfiles)
    .set({ monthlyGramsLimit: value, updatedAt: sql`now()` })
    .where(eq(patientProfiles.userId, userId));

  revalidatePath('/admin/socios/' + userId);
}
