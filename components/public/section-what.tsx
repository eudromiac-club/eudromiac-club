'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SectionWhat() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const reveals = root.current?.querySelectorAll('.reveal');
      if (!reveals || reveals.length === 0) return;

      gsap.from(reveals, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="club"
      className="border-t border-border/60"
      aria-labelledby="what-title"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:py-32 md:grid-cols-[1fr_2fr] md:gap-20">
        <div className="reveal">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            01 · El club
          </span>
          <h2
            id="what-title"
            className="mt-4 font-display text-4xl italic leading-tight tracking-tight sm:text-5xl"
          >
            Una asociación, no un mercado.
          </h2>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p className="reveal">
            eudromiac funciona bajo el modelo de club social cannábico:
            asociación civil sin fines de lucro, integrada por socios pacientes
            con permiso REPROCANN vigente. El acceso es nominal y por
            invitación de un socio activo.
          </p>
          <p className="reveal">
            No es un comercio. La cuota cubre la operación del club, el espacio
            y el cuidado del cultivo. Lo que se reparte se reparte entre
            quienes integramos el proyecto.
          </p>
        </div>
      </div>
    </section>
  );
}
