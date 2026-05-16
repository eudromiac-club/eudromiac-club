'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-eyebrow', { y: 12, opacity: 0, duration: 0.5 })
        .from(
          '.hero-word',
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power4.out',
          },
          '-=0.2',
        )
        .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '-=0.5')
        .from('.hero-lede', { y: 14, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.hero-cta', { y: 10, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.hero-meta', { opacity: 0, duration: 0.5 }, '-=0.2');
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-20 sm:py-28"
      aria-labelledby="hero-title"
    >
      <p className="hero-eyebrow mb-6 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
        Club privado · Acceso por invitación
      </p>

      <h1
        id="hero-title"
        className="font-display text-[clamp(3.5rem,11vw,9rem)] font-normal italic leading-[0.95] tracking-tight"
      >
        <span className="block overflow-hidden">
          <span className="hero-word inline-block">eudromiac</span>
        </span>
        <span className="block overflow-hidden text-muted-foreground">
          <span className="hero-word inline-block">club</span>
        </span>
      </h1>

      <div className="hero-rule mt-8 h-px w-32 bg-brand sm:w-48" aria-hidden />

      <p className="hero-lede mt-8 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
        Asociación civil de socios pacientes con permiso REPROCANN. Cinco
        genéticas seleccionadas, espacio cerrado, atención uno a uno.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button asChild className="hero-cta rounded-full px-6">
          <Link href="/login">Soy socio</Link>
        </Button>
        <Button asChild variant="outline" className="hero-cta rounded-full px-6">
          <a href="#club">Conocer el club</a>
        </Button>
      </div>

      <div className="hero-meta mt-16 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
        <span className="font-mono">REPROCANN · Ley 27.350</span>
        <span className="hidden sm:inline">·</span>
        <span>Asociación civil sin fines de lucro</span>
      </div>
    </section>
  );
}
