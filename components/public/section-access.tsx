'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    n: '01',
    title: 'Recibís una invitación',
    body: 'Un socio activo te comparte un link de un solo uso.',
  },
  {
    n: '02',
    title: 'Creás tu cuenta',
    body: 'Email, contraseña y nombre. Pocos minutos.',
  },
  {
    n: '03',
    title: 'Cargás tu REPROCANN',
    body: 'Subís el comprobante y el equipo lo valida.',
  },
  {
    n: '04',
    title: 'Accedés al catálogo',
    body: 'Cinco genéticas, pedido por mes hasta tu cap autorizado.',
  },
];

export function SectionAccess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const reveals = root.current?.querySelectorAll('.reveal');
      if (!reveals || reveals.length === 0) return;

      gsap.from(reveals, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
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
      id="acceso"
      className="border-t border-border/60"
      aria-labelledby="access-title"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="reveal max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            03 · Acceso
          </span>
          <h2
            id="access-title"
            className="mt-4 font-display text-4xl italic leading-tight tracking-tight sm:text-5xl"
          >
            Cómo se entra al club.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            El ingreso es por invitación nominal de un socio activo. No
            aceptamos solicitudes abiertas. Si te invitaron, seguís estos
            pasos.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="reveal relative border-l-2 border-brand/60 pl-5">
              <span className="font-mono text-xs text-brand">{s.n}</span>
              <h3 className="mt-2 text-base font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="reveal mt-16 flex flex-wrap items-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/login">Ya soy socio</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            ¿Tenés un link de invitación? Abrilo directamente.
          </span>
        </div>
      </div>
    </section>
  );
}
