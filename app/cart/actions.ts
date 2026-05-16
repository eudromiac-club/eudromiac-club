'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { carts, cartItems, genetics } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';

const HARD_CAP_PER_GENETIC = 10; // gramos por genética cap absoluto del flow

const AddSchema = z.object({
  geneticId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(HARD_CAP_PER_GENETIC),
});

export type CartActionState =
  | { ok: true; message?: string }
  | { ok: false; error: string }
  | undefined;

async function ensureCart(userId: string): Promise<string> {
  const [existing] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, userId)).limit(1);
  if (existing) return existing.id;
  const [created] = await db.insert(carts).values({ userId }).returning({ id: carts.id });
  return created.id;
}

async function assertActive() {
  const user = await requireUser();
  if (user.role === 'admin') return user;
  if (user.status !== 'active') {
    throw new Error('Tu cuenta no está habilitada para comprar.');
  }
  return user;
}

export async function addToCartAction(
  _prev: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  let user;
  try {
    user = await assertActive();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'No autorizado.' };
  }

  const parsed = AddSchema.safeParse({
    geneticId: formData.get('geneticId'),
    quantity: formData.get('quantity'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Datos inválidos.' };
  }
  const { geneticId, quantity } = parsed.data;

  const [g] = await db
    .select({
      id: genetics.id,
      stock: genetics.stock,
      active: genetics.active,
      cap: genetics.maxPerOrderGrams,
      name: genetics.name,
    })
    .from(genetics)
    .where(eq(genetics.id, geneticId))
    .limit(1);

  if (!g || !g.active) {
    return { ok: false, error: 'Esta genética ya no está disponible.' };
  }
  const cap = Math.min(HARD_CAP_PER_GENETIC, g.cap ? Math.floor(Number(g.cap)) : HARD_CAP_PER_GENETIC, g.stock);
  if (cap <= 0) {
    return { ok: false, error: 'Sin stock disponible.' };
  }

  const cartId = await ensureCart(user.id);

  const [existing] = await db
    .select({ quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.geneticId, geneticId)))
    .limit(1);
  const current = existing?.quantity ?? 0;
  const target = Math.min(current + quantity, cap);
  if (target === current) {
    return { ok: false, error: `Ya tenés el máximo permitido (${cap}g) de ${g.name}.` };
  }

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: target, updatedAt: sql`now()` })
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.geneticId, geneticId)));
  } else {
    await db.insert(cartItems).values({ cartId, geneticId, quantity: target });
  }

  revalidatePath('/dispensario');
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
  return { ok: true, message: `Agregado: ${target}g de ${g.name}.` };
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  const user = await assertActive();
  const parsed = AddSchema.safeParse({
    geneticId: formData.get('geneticId'),
    quantity: formData.get('quantity'),
  });
  if (!parsed.success) return;
  const { geneticId, quantity } = parsed.data;

  const [g] = await db
    .select({ stock: genetics.stock, cap: genetics.maxPerOrderGrams })
    .from(genetics)
    .where(eq(genetics.id, geneticId))
    .limit(1);
  if (!g) return;
  const cap = Math.min(HARD_CAP_PER_GENETIC, g.cap ? Math.floor(Number(g.cap)) : HARD_CAP_PER_GENETIC, g.stock);
  const target = Math.max(1, Math.min(quantity, cap));

  const cartId = await ensureCart(user.id);
  await db
    .update(cartItems)
    .set({ quantity: target, updatedAt: sql`now()` })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.geneticId, geneticId)));

  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
}

export async function removeFromCartAction(formData: FormData): Promise<void> {
  const user = await assertActive();
  const geneticId = formData.get('geneticId');
  if (typeof geneticId !== 'string') return;

  const [cart] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, user.id)).limit(1);
  if (!cart) return;

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.geneticId, geneticId)));

  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
}

export async function clearCartAction(): Promise<void> {
  const user = await assertActive();
  const [cart] = await db.select({ id: carts.id }).from(carts).where(eq(carts.userId, user.id)).limit(1);
  if (!cart) return;
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  revalidatePath('/carrito');
  revalidatePath('/', 'layout');
}
