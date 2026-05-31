'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/dal';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';

export type NewCouponState =
  | undefined
  | { ok: true; code: string }
  | { ok: false; errors?: Partial<Record<'code' | 'discountPct' | 'expiresAt' | 'form', string>> };

export async function createCouponAction(
  _prev: NewCouponState,
  formData: FormData,
): Promise<NewCouponState> {
  await requireAdmin();

  const code = String(formData.get('code') ?? '')
    .trim()
    .toUpperCase();
  const discountRaw = String(formData.get('discountPct') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const expiresRaw = String(formData.get('expiresAt') ?? '').trim();

  const errors: NonNullable<Extract<NewCouponState, { ok: false }>['errors']> = {};

  if (!/^[A-Z0-9]{3,30}$/.test(code)) {
    errors.code = 'Código de 3 a 30 caracteres, solo letras y números.';
  }

  const discountPct = Number(discountRaw);
  if (!Number.isInteger(discountPct) || discountPct < 1 || discountPct > 100) {
    errors.discountPct = 'El descuento tiene que ser un número entero del 1 al 100.';
  }

  let expiresAt: Date | null = null;
  if (expiresRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiresRaw)) {
      errors.expiresAt = 'Fecha inválida.';
    } else {
      // Vence al final del día elegido (23:59:59 UTC).
      const d = new Date(`${expiresRaw}T23:59:59Z`);
      if (Number.isNaN(d.getTime())) errors.expiresAt = 'Fecha inválida.';
      else if (d.getTime() < Date.now()) errors.expiresAt = 'La fecha ya pasó.';
      else expiresAt = d;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  try {
    await db.insert(coupons).values({
      code,
      discountPct,
      description: description || null,
      expiresAt,
    });
  } catch (e) {
    // Violación de unique (code) u otro error.
    if (e instanceof Error && /unique|duplicate/i.test(e.message)) {
      return { ok: false, errors: { code: 'Ya existe un cupón con ese código.' } };
    }
    console.error('[cupones] error al crear:', e);
    return { ok: false, errors: { form: 'No pudimos crear el cupón. Probá de nuevo.' } };
  }

  revalidatePath('/admin/cupones');
  return { ok: true, code };
}

export async function toggleCouponActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const active = formData.get('active') === 'true';
  if (!id) return;
  await db.update(coupons).set({ active }).where(eq(coupons.id, id));
  revalidatePath('/admin/cupones');
}

export async function deleteCouponAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await db.delete(coupons).where(eq(coupons.id, id));
  revalidatePath('/admin/cupones');
}
