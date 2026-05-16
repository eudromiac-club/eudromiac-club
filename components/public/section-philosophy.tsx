'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VALUES = [
  {
    n: '01',
    title: 'Comunidad pequeña',
    body: 'El número de socios se mantiene acotado a propósito. Conocemos a quienes integran el club.',
  },
  {
    n: '02',
    title: 'Curaduría',
    body: 'Cinco genéticas, no cien. Cada una tiene un porqué y se mantiene mientras tenga sentido.',
  },
  {
    n: '03',
    title: 'Cuidado del proceso',
    body: 'Atención al cultivo, al espacio y a la relación con cada socio. Sin prisa, sin promesas vacías.',
  },
];

export function SectionPhilosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const heading = root.current?.querySelector('.reveal-heading');
      const cards = root.current?.querySelectorAll('.reveal-card');

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      if (heading) tl.from(heading, { y: 24, opacity: 0, duration: 0.7 });
      if (cards && cards.length > 0) {
        tl.from(cards, { y: 24, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.4');
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="filosofia"
      className="relative grain bg-brand-muted/40 py-24 sm:py-32"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal-heading max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            02 · Filosofía
          </span>
          <h2
            id="philosophy-title"
            className="mt-4 font-display text-4xl italic leading-tight tracking-tight sm:text-5xl"
          >
            Cómo trabajamos.
          </h2>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
          {VALUES.map((v) => (
            <li key={v.n} className="reveal-card flex h-full flex-col bg-background p-6 sm:p-8">
              <span className="font-mono text-xs text-brand">{v.n}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
