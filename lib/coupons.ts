import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_KEY = 'eudromia_coupon';

// Cupones hardcodeados. Si en algún momento son varios, mover a tabla DB.
const COUPONS: Record<string, { discountPct: number }> = {
  FULLOFF: { discountPct: 100 },
};

export type ValidCoupon = { code: string; discountPct: number };

export function validateCoupon(rawCode: string): ValidCoupon | null {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;
  const entry = COUPONS[code];
  if (!entry) return null;
  return { code, discountPct: entry.discountPct };
}

export async function getAppliedCoupon(): Promise<ValidCoupon | null> {
  const jar = await cookies();
  const code = jar.get(COOKIE_KEY)?.value;
  if (!code) return null;
  return validateCoupon(code);
}

export async function setAppliedCoupon(code: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_KEY, code, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAppliedCoupon(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_KEY);
}

export function calcDiscount(subtotalCents: number, coupon: ValidCoupon | null): number {
  if (!coupon) return 0;
  return Math.min(subtotalCents, Math.round((subtotalCents * coupon.discountPct) / 100));
}
