'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';

const NEXT_STATUS = z.enum(['paid', 'shipped', 'delivered', 'cancelled', 'refunded']);

const UpdateSchema = z.object({
  orderId: z.string().uuid(),
  status: NEXT_STATUS,
});

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = UpdateSchema.safeParse({
    orderId: formData.get('orderId'),
    status: formData.get('status'),
  });
  if (!parsed.success) return;

  await db
    .update(orders)
    .set({ status: parsed.data.status, updatedAt: sql`now()` })
    .where(eq(orders.id, parsed.data.orderId));

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin/pedidos/' + parsed.data.orderId);
  revalidatePath('/cuenta/pedidos');
}
