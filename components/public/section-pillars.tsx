'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PillarCuracion, PillarGuia, PillarSantuario } from '@/components/brand/pillar-icons';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  {
    id: 'curacion',
    Icon: PillarCuracion,
    label: 'Curaduría Genética',
    body: 'Selección rigurosa de las cepas terapéuticas más puras y estables del mundo.',
  },
  {
    id: 'guia',
    Icon: PillarGuia,
    label: 'Guía Personalizada',
    body: 'Trazamos un mapa de ruta individual hacia el bienestar con precisión.',
  },
  {
    id: 'santuario',
    Icon: PillarSantuario,
    label: 'El Santuario Privado',
    body: 'Acceso exclusivo a un entorno seguro y sofisticado para la desconexión.',
  },
];

export function SectionPillars() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.pillar-title-line', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.pillar-title',
          start: 'top 90%',
          once: true,
        },
      });

      gsap.from('.pillar-item', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.22,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.pillar-grid',
          start: 'top 90%',
          once: true,
        },
      });

      // Parallax: cada icono se mueve a una velocidad ligeramente distinta
      // mientras la sección está en viewport. Da profundidad cinematográfica.
      gsap.utils.toArray<HTMLElement>('.pillar-item').forEach((item, i) => {
        const icon = item.querySelector('.pillar-icon');
        if (!icon) return;
        gsap.to(icon, {
          y: -40 - i * 10,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

      // Glow lento del icono dentro del arco
      gsap.to('.pillar-icon', {
        filter: 'drop-shadow(0 0 14px hsl(var(--brand) / 0.55))',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.7, from: 'start' },
      });

      // Refresh ScrollTrigger después de un tick para que recalcule con el
      // layout final post-hidratación (fuentes, imágenes async).
      const timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(timeout);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="pilares"
      className="relative isolate overflow-hidden border-b border-border/30 py-24 sm:py-32"
      aria-labelledby="pillars-title"
    >
      {/* Glow muy sutil al fondo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, hsl(32 70% 50% / 0.4), transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden
      />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="pillar-title">
          <h2
            id="pillars-title"
            className="font-display text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium uppercase tracking-[0.18em] text-foreground"
          >
            <span className="pillar-title-line block">Nuestros pilares</span>
            <span className="pillar-title-line block text-brand">fundamentales</span>
          </h2>
        </div>

        <ul className="pillar-grid mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {PILLARS.map((p) => (
            <li
              key={p.id}
              className="pillar-item group flex flex-col items-center"
            >
              <p.Icon className="pillar-icon h-32 w-32 transition-transform duration-500 group-hover:scale-105 sm:h-40 sm:w-40" />
              <h3 className="mt-6 font-display text-base font-medium uppercase tracking-[0.22em] text-brand sm:text-lg">
                {p.label}
              </h3>
              <p className="mt-3 max-w-xs text-balance text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
