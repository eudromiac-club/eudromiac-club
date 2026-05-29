'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/dal';
import { setLeadContacted } from '@/lib/leads/server';

export async function toggleLeadContactedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get('id') as string;
  const contacted = formData.get('contacted') === 'true';
  if (!id) return;
  await setLeadContacted(id, contacted);
  revalidatePath('/admin/leads');
  revalidatePath('/admin', 'layout');
}
