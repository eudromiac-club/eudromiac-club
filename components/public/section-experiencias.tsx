import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function SectionExperiencias() {
  return (
    <section
      id="experiencias"
      className="relative isolate overflow-hidden border-y border-border/30"
      aria-labelledby="experiencias-title"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/experiencias/experiencias-fondo-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/experiencias/experiencias-fondo-web.webp"
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 50% 50%, hsl(var(--background) / 0.66), transparent 75%), linear-gradient(to bottom, hsl(var(--background) / 0.6), hsl(var(--background) / 0.5) 50%, hsl(var(--background) / 0.8))',
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center gap-7 px-6 py-28 text-center [text-shadow:0_2px_22px_hsl(var(--background)_/_0.85)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">◆ Experiencias</p>
        <h2
          id="experiencias-title"
          className="text-balance font-display text-[clamp(2rem,6vw,3.75rem)] font-medium uppercase leading-[1.05] tracking-[0.04em]"
        >
          <span className="block">Viajes hacia el</span>
          <span className="block text-brand">equilibrio.</span>
        </h2>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <p className="mx-auto max-w-xl text-balance text-base leading-relaxed text-foreground sm:text-lg">
          Experiencias inmersivas para desacelerar, reconectar y expandir la percepción.
        </p>
        <Button
          asChild
          className="mt-4 rounded-none bg-brand px-10 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
        >
          <Link href="/experiencias">Más información</Link>
        </Button>
      </div>
    </section>
  );
}
