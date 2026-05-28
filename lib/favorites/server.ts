import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { favorites, genetics } from '@/lib/db/schema';

// IDs de genéticas favoritas del socio (para pintar el corazón en grilla/interna).
export async function getFavoriteGeneticIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ geneticId: favorites.geneticId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return new Set(rows.map((r) => r.geneticId));
}

export async function isFavorite(userId: string, geneticId: string): Promise<boolean> {
  const [row] = await db
    .select({ geneticId: favorites.geneticId })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.geneticId, geneticId)))
    .limit(1);
  return !!row;
}

// Genéticas favoritas con sus datos, para la página de favoritos. Solo activas.
export async function getFavorites(userId: string) {
  return db
    .select({
      id: genetics.id,
      slug: genetics.slug,
      name: genetics.name,
      type: genetics.type,
      thcPercent: genetics.thcPercent,
      priceCents: genetics.priceCents,
      stock: genetics.stock,
      images: genetics.images,
      addedAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(genetics, eq(favorites.geneticId, genetics.id))
    .where(and(eq(favorites.userId, userId), eq(genetics.active, true)))
    .orderBy(desc(favorites.createdAt));
}
