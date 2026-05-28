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
  { n: 'I', title: 'Creás tu cuenta', body: 'Tus datos personales y tu número de trámite REPROCANN. Lleva un minuto.' },
  { n: 'II', title: 'Subís el comprobante', body: 'Desde tu panel cargás el PDF o foto del permiso vigente.' },
  { n: 'III', title: 'Validamos tu permiso', body: 'El equipo revisa cada solicitud uno a uno y te confirmamos.' },
  { n: 'IV', title: 'Ingresás al club', body: 'Acceso a la colección curada y a la guía personalizada.' },
];

export function SectionAccess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.acc-title-line', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: { trigger: '.acc-title', start: 'top 90%', once: true },
      });
      gsap.from('.acc-step', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        immediateRender: false,
        scrollTrigger: { trigger: '.acc-steps', start: 'top 90%', once: true },
      });
      gsap.from('.acc-cta', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        immediateRender: false,
        scrollTrigger: { trigger: '.acc-cta', start: 'top 95%', once: true },
      });

      const timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(timeout);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="acceso"
      className="relative isolate overflow-hidden py-24 sm:py-32"
      aria-labelledby="access-title"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[60vmin] w-[60vmin] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(42 70% 50% / 0.5), transparent 60%)',
          filter: 'blur(100px)',
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2
          id="access-title"
          className="acc-title font-display text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium uppercase tracking-[0.18em]"
        >
          <span className="acc-title-line block">Cómo se ingresa</span>
          <span className="acc-title-line block text-brand">al santuario.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
          El ingreso requiere REPROCANN vigente. Si todavía no lo tenés, nuestro
          equipo médico lo gestiona con vos. Creás tu cuenta, subís el comprobante
          y validamos tu acceso al dispensario.
        </p>

        <ol className="acc-steps mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="acc-step flex flex-col items-center text-center">
              <span className="font-display text-2xl italic text-brand">{s.n}</span>
              <div className="my-3 h-px w-8 bg-brand/60" />
              <h3 className="text-[11px] font-medium uppercase tracking-[0.25em]">{s.title}</h3>
              <p className="mt-2 max-w-[20ch] text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="acc-cta mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          <Button
            asChild
            className="rounded-none px-8 py-6 text-[11px] uppercase tracking-[0.3em]"
          >
            <Link href="/registro">Asociarse</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-none border-brand/60 bg-transparent px-8 py-6 text-[11px] uppercase tracking-[0.3em] text-brand hover:border-brand hover:bg-brand/10 hover:text-brand"
          >
            <Link href="/login">Miembros</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
