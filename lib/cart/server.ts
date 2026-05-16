import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { carts, cartItems, genetics } from '@/lib/db/schema';

export type CartLineItem = {
  geneticId: string;
  name: string;
  slug: string;
  image: string | null;
  unitPriceCents: number;
  quantity: number;
  subtotalCents: number;
  stock: number;
  cap: number;
};

export type CartSnapshot = {
  itemCount: number;
  totalGrams: number;
  totalCents: number;
  items: CartLineItem[];
};

const HARD_CAP = 10;

export async function getCartSnapshot(userId: string): Promise<CartSnapshot> {
  const rows = await db
    .select({
      geneticId: cartItems.geneticId,
      quantity: cartItems.quantity,
      name: genetics.name,
      slug: genetics.slug,
      image: sql<string | null>`${genetics.images}[1]`,
      priceCents: genetics.priceCents,
      stock: genetics.stock,
      cap: genetics.maxPerOrderGrams,
      active: genetics.active,
    })
    .from(carts)
    .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
    .innerJoin(genetics, eq(genetics.id, cartItems.geneticId))
    .where(and(eq(carts.userId, userId), eq(genetics.active, true)));

  const items: CartLineItem[] = rows.map((r) => ({
    geneticId: r.geneticId,
    name: r.name,
    slug: r.slug,
    image: r.image,
    unitPriceCents: r.priceCents,
    quantity: r.quantity,
    subtotalCents: r.priceCents * r.quantity,
    stock: r.stock,
    cap: Math.min(HARD_CAP, r.cap ? Math.floor(Number(r.cap)) : HARD_CAP, r.stock),
  }));

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalCents = items.reduce((acc, i) => acc + i.subtotalCents, 0);
  return { itemCount, totalGrams: itemCount, totalCents, items };
}

export async function getCartCount(userId: string | null | undefined): Promise<number> {
  if (!userId) return 0;
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${cartItems.quantity}), 0)::int` })
    .from(carts)
    .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
    .where(eq(carts.userId, userId));
  return row?.total ?? 0;
}
