'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/dal';

const GeneticIdSchema = z.string().uuid();

export type ToggleFavoriteResult = { ok: true; favorited: boolean } | { ok: false };

// Toggle del favorito. Cualquier socio logueado puede favoritear (no requiere
// estar activo). Devuelve el nuevo estado para que el cliente confirme/corrija
// su UI optimista.
export async function toggleFavoriteAction(geneticId: string): Promise<ToggleFavoriteResult> {
  const parsed = GeneticIdSchema.safeParse(geneticId);
  if (!parsed.success) return { ok: false };

  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false };
  }
  const gid = parsed.data;

  const [existing] = await db
    .select({ geneticId: favorites.geneticId })
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.geneticId, gid)))
    .limit(1);

  let favorited: boolean;
  if (existing) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.geneticId, gid)));
    favorited = false;
  } else {
    // onConflictDoNothing por si hay doble click / carrera.
    await db.insert(favorites).values({ userId: user.id, geneticId: gid }).onConflictDoNothing();
    favorited = true;
  }

  revalidatePath('/cuenta/favoritos');
  revalidatePath('/dispensario');
  revalidatePath(`/dispensario`, 'page');
  return { ok: true, favorited };
}
