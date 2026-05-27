'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { LoopVideo } from '@/components/brand/loop-video';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VALUES = ['Exclusividad', 'Consciencia', 'Experiencia'];

export function SectionBrandFilm() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.bf-film', {
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });

      gsap.from('.bf-copy > *', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden border-b border-border/30 py-24 sm:py-32"
      aria-labelledby="brand-film-title"
    >
      {/* Glow cobre sutil al fondo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(32 70% 50% / 0.4), transparent 60%)',
          filter: 'blur(90px)',
        }}
        aria-hidden
      />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 md:grid-cols-[auto_1fr] md:gap-16">
        {/* Film vertical enmarcado */}
        <div className="bf-film mx-auto w-full max-w-[18rem]">
          <OrnateFrame>
            <div className="relative aspect-[332/816] overflow-hidden bg-[#f4ede1]">
              <LoopVideo
                src="/brand/logo.mp4"
                poster="/brand/logo-poster.jpg"
                ariaLabel="Animación del emblema EUDROMIA"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </OrnateFrame>
        </div>

        {/* Copy de marca */}
        <div className="bf-copy text-center md:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Identidad
          </p>
          <h2
            id="brand-film-title"
            className="mt-4 font-display text-[clamp(1.75rem,4.2vw,3rem)] font-medium uppercase leading-[1.1] tracking-[0.06em] text-foreground"
          >
            Un emblema
            <br />
            <span className="text-brand">vivo.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-balance text-base leading-relaxed text-muted-foreground md:mx-0">
            Cada gramo nace de una curaduría obsesiva. Nuestro sello no es una
            marca: es la promesa de un viaje hacia el equilibrio.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 md:justify-start">
            {VALUES.map((v) => (
              <li
                key={v}
                className="font-display text-sm uppercase tracking-[0.28em] text-brand"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
