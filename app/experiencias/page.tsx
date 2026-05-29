import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBackground } from '@/components/layout/page-background';
import { LeadForm } from './lead-form';

export const metadata: Metadata = {
  title: 'Experiencias · EUDROMIA CLUB',
  description:
    'Viajes hacia el equilibrio: experiencias inmersivas para desacelerar, reconectar y expandir la percepción.',
};

export default function ExperienciasPage() {
  return (
    <>
      <PageBackground
        mobileSrc="/experiencias/experiencias-fondo-mobile.webp"
        webSrc="/experiencias/experiencias-fondo-web.webp"
        priority
        overlayStyle={{
          background:
            'linear-gradient(to bottom, hsl(var(--background) / 0.72), hsl(var(--background) / 0.82) 55%, hsl(var(--background) / 0.92))',
        }}
      />
      <main className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">◆ Experiencias</p>
        <h1 className="mt-4 text-balance font-display text-[clamp(2rem,6vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-[0.04em]">
          Viajes hacia el equilibrio
        </h1>
        <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <p className="mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Experiencias inmersivas para desacelerar, reconectar y expandir la percepción.
        </p>

        <div className="mt-12 w-full max-w-md text-left">
          <div className="border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-center font-display text-sm uppercase tracking-[0.18em] text-foreground">
              Dejanos tus datos y te enviamos más info
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Volver al inicio
        </Link>
      </main>
    </>
  );
}
