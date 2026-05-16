import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { genetics } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { GeneticForm } from '../genetic-form';
import { deleteGeneticAction } from '../actions';

export const metadata = {
  title: 'Editar genética · Admin · EUDROMIA CLUB',
};

export default async function EditGeneticPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [g] = await db.select().from(genetics).where(eq(genetics.id, id)).limit(1);
  if (!g) notFound();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/genetics"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            ← Volver a genéticas
          </Link>
          <h1 className="mt-4 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
            Editar <span className="text-brand">{g.name}</span>.
          </h1>
        </div>
        <form action={deleteGeneticAction}>
          <input type="hidden" name="id" value={g.id} />
          <Button
            type="submit"
            variant="ghost"
            className="text-[11px] uppercase tracking-[0.2em] text-destructive hover:text-destructive"
          >
            Borrar
          </Button>
        </form>
      </header>

      <GeneticForm initial={g} />
    </div>
  );
}
