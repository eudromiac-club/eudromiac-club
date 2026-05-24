'use server';

import { revalidatePath } from 'next/cache';
import { setAppliedCoupon, clearAppliedCoupon, validateCoupon } from '@/lib/coupons';

export type CouponState = { ok: true; code: string } | { ok: false; error: string } | undefined;

export async function applyCouponAction(
  _prev: CouponState,
  formData: FormData,
): Promise<CouponState> {
  const raw = String(formData.get('code') ?? '');
  if (!raw.trim()) return { ok: false, error: 'Ingresá un código.' };
  const coupon = validateCoupon(raw);
  if (!coupon) return { ok: false, error: 'Código no válido.' };
  await setAppliedCoupon(coupon.code);
  revalidatePath('/carrito');
  return { ok: true, code: coupon.code };
}

export async function removeCouponAction(): Promise<void> {
  await clearAppliedCoupon();
  revalidatePath('/carrito');
}
