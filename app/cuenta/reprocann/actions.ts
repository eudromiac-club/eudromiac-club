'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { users, patientProfiles, patientStatusHistory } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';
import { uploadFile } from '@/lib/storage/blob';

const SubmitSchema = z.object({
  fullName: z.string().trim().min(3, { error: 'Ingresá tu nombre completo.' }).max(120),
  dni: z
    .string()
    .trim()
    .regex(/^\d{6,10}$/, { error: 'DNI inválido (solo números, 6-10 dígitos).' }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Fecha de nacimiento inválida.' }),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  reprocannNumber: z
    .string()
    .trim()
    .min(3, { error: 'Ingresá el número de tu permiso REPROCANN.' })
    .max(60),
  reprocannExpiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Fecha de vencimiento inválida.' }),
  doctorName: z
    .string()
    .trim()
    .min(3, { error: 'Ingresá el nombre del médico tratante.' })
    .max(120),
  doctorLicense: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  doctorProvince: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type SubmitReprocannState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string[]>; form?: string }
  | undefined;

export async function submitReprocannAction(
  _prev: SubmitReprocannState,
  formData: FormData,
): Promise<SubmitReprocannState> {
  const user = await requireUser();

  // Permitir resubir si está pending_kyc o si fue rechazado y quiere reintentar.
  // No permitir resubir si ya está active o ya está under_review (espere).
  if (user.status === 'active') {
    return { ok: false, form: 'Tu cuenta ya está verificada.' };
  }
  if (user.status === 'under_review') {
    return { ok: false, form: 'Ya enviaste tu solicitud, esperá la revisión del equipo.' };
  }
  if (user.status === 'suspended' || user.status === 'inactive') {
    return { ok: false, form: 'Tu cuenta está bloqueada. Contactá al club.' };
  }

  const parsed = SubmitSchema.safeParse({
    fullName: formData.get('fullName'),
    dni: formData.get('dni'),
    birthDate: formData.get('birthDate'),
    phone: formData.get('phone'),
    reprocannNumber: formData.get('reprocannNumber'),
    reprocannExpiresAt: formData.get('reprocannExpiresAt'),
    doctorName: formData.get('doctorName'),
    doctorLicense: formData.get('doctorLicense'),
    doctorProvince: formData.get('doctorProvince'),
    notes: formData.get('notes'),
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const file = formData.get('document');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, errors: { document: ['Adjuntá el comprobante del REPROCANN (PDF/imagen).'] } };
  }

  const upload = await uploadFile(`reprocann/${user.id}`, file);
  if (!upload.ok) {
    return { ok: false, errors: { document: [upload.error] } };
  }

  const d = parsed.data;

  try {
    await db.transaction(async (tx) => {
      // upsert patient_profile
      await tx
        .insert(patientProfiles)
        .values({
          userId: user.id,
          fullName: d.fullName,
          dni: d.dni,
          birthDate: d.birthDate,
          phone: d.phone ?? null,
          reprocannNumber: d.reprocannNumber,
          reprocannStatus: 'pending_review',
          reprocannExpiresAt: d.reprocannExpiresAt,
          reprocannDocUrl: upload.url,
          doctorName: d.doctorName,
          doctorLicense: d.doctorLicense ?? null,
          doctorProvince: d.doctorProvince ?? null,
          notes: d.notes ?? null,
        })
        .onConflictDoUpdate({
          target: patientProfiles.userId,
          set: {
            fullName: d.fullName,
            dni: d.dni,
            birthDate: d.birthDate,
            phone: d.phone ?? null,
            reprocannNumber: d.reprocannNumber,
            reprocannStatus: 'pending_review',
            reprocannExpiresAt: d.reprocannExpiresAt,
            reprocannDocUrl: upload.url,
            doctorName: d.doctorName,
            doctorLicense: d.doctorLicense ?? null,
            doctorProvince: d.doctorProvince ?? null,
            notes: d.notes ?? null,
            updatedAt: sql`now()`,
          },
        });

      // user → under_review
      await tx
        .update(users)
        .set({ status: 'under_review', updatedAt: sql`now()` })
        .where(eq(users.id, user.id));

      // audit log
      await tx.insert(patientStatusHistory).values({
        userId: user.id,
        fromStatus: user.status,
        toStatus: 'under_review',
        reason: 'Socio envió documentación REPROCANN.',
        changedBy: user.id,
      });
    });
  } catch (e) {
    console.error('[reprocann/submit] db error:', e);
    return { ok: false, form: 'No pudimos guardar tu solicitud. Probá de nuevo.' };
  }

  revalidatePath('/cuenta');
  revalidatePath('/cuenta/reprocann');
  revalidatePath('/admin');
  revalidatePath('/admin/solicitudes');
  return { ok: true };
}
