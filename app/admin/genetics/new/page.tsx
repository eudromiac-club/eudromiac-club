import Link from 'next/link';
import { GeneticForm } from '../genetic-form';

export const metadata = {
  title: 'Nueva genética · Admin · EUDROMIA CLUB',
};

export default function NewGeneticPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/genetics"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          ← Volver a genéticas
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium uppercase tracking-[0.1em] sm:text-4xl">
          Nueva <span className="text-brand">genética</span>.
        </h1>
      </header>

      <GeneticForm />
    </div>
  );
}
