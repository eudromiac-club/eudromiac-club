import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { notifyTeamNewLead } from '@/lib/email/notify';

export type LeadInput = {
  name?: string | null;
  email: string;
  phone: string;
  source?: string;
  message?: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFieldErrors = { name?: string; email?: string; phone?: string };

// Valida server-side el form de captación. Email y teléfono obligatorios.
export function parseLeadForm(
  formData: FormData,
): { ok: true; value: LeadInput } | { ok: false; errors: LeadFieldErrors } {
  const name = (formData.get('name') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const phone = (formData.get('phone') as string | null)?.trim() ?? '';
  const source = (formData.get('source') as string | null)?.trim() || 'experiencias';

  const errors: LeadFieldErrors = {};
  if (!email) errors.email = 'Dejanos tu email.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Revisá el email.';
  if (!phone) errors.phone = 'Dejanos tu teléfono.';
  else if (phone.replace(/\D/g, '').length < 6) errors.phone = 'Revisá el teléfono.';
  if (name && name.length > 120) errors.name = 'Nombre demasiado largo.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, phone, source } };
}

// Guarda el lead y avisa al equipo (best-effort: el email no rompe el guardado).
export async function createLead(input: LeadInput): Promise<void> {
  await db.insert(leads).values({
    name: input.name ?? null,
    email: input.email,
    phone: input.phone,
    source: input.source ?? 'experiencias',
    message: input.message ?? null,
  });

  await notifyTeamNewLead({
    name: input.name ?? null,
    email: input.email,
    phone: input.phone,
    source: input.source ?? 'experiencias',
  });
}

export async function listLeads() {
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function setLeadContacted(id: string, contacted: boolean): Promise<void> {
  await db.update(leads).set({ contacted }).where(eq(leads.id, id));
}
