'use server';

import { revalidatePath } from 'next/cache';
import { parseLeadForm, createLead, type LeadFieldErrors } from '@/lib/leads/server';

export type LeadState =
  | { ok: true }
  | { ok: false; message?: string; errors?: LeadFieldErrors }
  | undefined;

export async function submitLeadAction(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = parseLeadForm(formData);
  if (!parsed.ok) {
    return { ok: false, errors: parsed.errors };
  }

  try {
    await createLead(parsed.value);
  } catch (e) {
    console.error('[leads] error guardando lead:', e);
    return { ok: false, message: 'No pudimos guardar tus datos. Probá de nuevo en un momento.' };
  }

  revalidatePath('/admin/leads');
  revalidatePath('/admin', 'layout');
  return { ok: true };
}
