'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SectionExperiencias() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Parallax del fondo (scrub): la foto se mueve más lento que el scroll.
      // No depende de reduce-motion del contenido, pero igual lo respetamos.
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '.exp-bg',
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );

      // Reveal del título con máscara (cada línea sube desde abajo, clippeada).
      gsap.from('.exp-title-line', {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
      });

      // Reveal del resto del contenido.
      gsap.from('.exp-reveal', {
        opacity: 0,
        y: 32,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });

      const t = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(t);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="experiencias"
      className="relative isolate overflow-hidden border-y border-border/30"
      aria-labelledby="experiencias-title"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="exp-bg absolute inset-x-0 -inset-y-[14%] will-change-transform">
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
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 50% 50%, hsl(var(--background) / 0.66), transparent 75%), linear-gradient(to bottom, hsl(var(--background) / 0.6), hsl(var(--background) / 0.5) 50%, hsl(var(--background) / 0.8))',
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center gap-7 px-6 py-28 text-center [text-shadow:0_2px_22px_hsl(var(--background)_/_0.85)]">
        <p className="exp-reveal font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
          ◆ Experiencias
        </p>
        <h2
          id="experiencias-title"
          className="font-display text-[clamp(2rem,6vw,3.75rem)] font-medium uppercase leading-[1.05] tracking-[0.04em]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="exp-title-line inline-block">Viajes hacia el</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="exp-title-line inline-block text-brand">equilibrio.</span>
          </span>
        </h2>
        <div className="exp-reveal h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />
        <p className="exp-reveal mx-auto max-w-xl text-balance text-base leading-relaxed text-foreground sm:text-lg">
          Experiencias inmersivas para desacelerar, reconectar y expandir la percepción.
        </p>
        <Button
          asChild
          className="exp-reveal mt-4 rounded-none bg-brand px-10 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
        >
          <Link href="/experiencias">Más información</Link>
        </Button>
      </div>
    </section>
  );
}
