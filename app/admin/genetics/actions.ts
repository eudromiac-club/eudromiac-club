'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/dal';

const GeneticSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, { error: 'Nombre demasiado corto.' }).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, { error: 'Slug inválido (solo a-z, 0-9 y guiones).' })
    .max(120)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  type: z.enum(['sativa', 'indica', 'hybrid', 'cbd']),
  thcPercent: z
    .union([z.coerce.number().min(0).max(99.99), z.literal('').transform(() => null)])
    .nullable()
    .optional(),
  cbdPercent: z
    .union([z.coerce.number().min(0).max(99.99), z.literal('').transform(() => null)])
    .nullable()
    .optional(),
  priceArs: z.coerce.number().min(0, { error: 'Precio inválido.' }),
  stock: z.coerce.number().int().min(0, { error: 'Stock inválido.' }),
  maxPerOrderGrams: z
    .union([z.coerce.number().min(0.01).max(999.99), z.literal('').transform(() => null)])
    .nullable()
    .optional(),
  imageUrl: z
    .string()
    .trim()
    .url({ error: 'URL de imagen inválida.' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
  active: z
    .union([z.literal('on'), z.literal('true'), z.literal('false'), z.literal('')])
    .optional()
    .transform((v) => v === 'on' || v === 'true'),
});

export type GeneticFormState =
  | { ok: true; id: string }
  | { ok: false; errors?: Record<string, string[]>; form?: string }
  | undefined;

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

export async function upsertGeneticAction(
  _prev: GeneticFormState,
  formData: FormData,
): Promise<GeneticFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = GeneticSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const d = parsed.data;
  const slug = d.slug ?? slugify(d.name);
  const images = d.imageUrl ? [d.imageUrl] : [];

  const values = {
    name: d.name,
    slug,
    description: d.description ?? null,
    type: d.type,
    thcPercent: d.thcPercent != null ? String(d.thcPercent) : null,
    cbdPercent: d.cbdPercent != null ? String(d.cbdPercent) : null,
    priceCents: Math.round(d.priceArs * 100),
    stock: d.stock,
    maxPerOrderGrams: d.maxPerOrderGrams != null ? String(d.maxPerOrderGrams) : null,
    images,
    active: d.active ?? false,
    updatedAt: new Date(),
  };

  try {
    let id = d.id;
    if (id) {
      await db.update(genetics).set(values).where(eq(genetics.id, id));
    } else {
      const [created] = await db.insert(genetics).values(values).returning({ id: genetics.id });
      id = created.id;
    }
    revalidatePath('/admin/genetics');
    revalidatePath('/dispensario');
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error desconocido.';
    if (msg.includes('unique') && msg.includes('slug')) {
      return { ok: false, form: 'Ya existe una genética con ese slug.' };
    }
    console.error('[admin/genetics] upsert error:', e);
    return { ok: false, form: 'No pudimos guardar. Probá de nuevo.' };
  }
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get('id');
  if (typeof id !== 'string') return;
  const [row] = await db.select({ active: genetics.active }).from(genetics).where(eq(genetics.id, id)).limit(1);
  if (!row) return;
  await db.update(genetics).set({ active: !row.active, updatedAt: new Date() }).where(eq(genetics.id, id));
  revalidatePath('/admin/genetics');
  revalidatePath('/dispensario');
}

export async function deleteGeneticAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get('id');
  if (typeof id !== 'string') return;
  try {
    await db.delete(genetics).where(eq(genetics.id, id));
  } catch (e) {
    // Fallback defensivo: si por algún motivo el borrado físico falla (p. ej.
    // una FK no relajada en una base sin migrar), al menos sacamos la genética
    // del dispensario desactivándola, en vez de romper con la pantalla de error.
    console.error('[admin/genetics] delete error, falling back to deactivate:', e);
    await db.update(genetics).set({ active: false, updatedAt: new Date() }).where(eq(genetics.id, id));
  }
  revalidatePath('/admin/genetics');
  revalidatePath('/dispensario');
  redirect('/admin/genetics');
}
