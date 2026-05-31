import 'server-only';
import { cookies } from 'next/headers';
import { and, eq, gt, isNull, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';

const COOKIE_KEY = 'eudromia_coupon';

// FULLOFF queda hardcodeado como fallback de testing: aunque la tabla coupons
// esté vacía (DB nueva), siempre se puede probar el flow end-to-end gratis.
// El resto de los cupones se gestionan desde /admin/cupones (tabla coupons).
const FALLBACK_COUPONS: Record<string, { discountPct: number }> = {
  FULLOFF: { discountPct: 100 },
};

export type ValidCoupon = { code: string; discountPct: number };

// Valida un código contra la tabla coupons (activo y no vencido). Si no existe
// en DB, cae al fallback hardcodeado. Es async porque pega a la base.
export async function validateCoupon(rawCode: string): Promise<ValidCoupon | null> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  const [row] = await db
    .select({ code: coupons.code, discountPct: coupons.discountPct })
    .from(coupons)
    .where(
      and(
        eq(coupons.code, code),
        eq(coupons.active, true),
        or(isNull(coupons.expiresAt), gt(coupons.expiresAt, new Date())),
      ),
    )
    .limit(1);

  if (row) return { code: row.code.toUpperCase(), discountPct: row.discountPct };

  const fallback = FALLBACK_COUPONS[code];
  if (fallback) return { code, discountPct: fallback.discountPct };

  return null;
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
