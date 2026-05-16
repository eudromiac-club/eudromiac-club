'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Item = {
  id: string;
  label: string;
  body: string;
  kind: 'image' | 'art-amber' | 'art-mortar';
  image?: string;
  alt?: string;
};

const ITEMS: Item[] = [
  {
    id: 'flores',
    label: 'Flores de Autor',
    body: 'Selección curada de cepas florales, cultivadas con primor para una experiencia sensorial completa.',
    kind: 'image',
    image: '/landing/flower-cannabis.jpg',
    alt: 'Macro de flor de cannabis con tricomas',
  },
  {
    id: 'extractos',
    label: 'Extractos Puros',
    body: 'Concentrados botánicos de la más alta pureza, capturando la esencia de la planta en su estado más cristalino.',
    kind: 'art-amber',
  },
  {
    id: 'formulas',
    label: 'Fórmulas Magistrales',
    body: 'Mezclas personalizadas y aceites medicinales desarrollados con respeto por la herencia herbolaria.',
    kind: 'art-mortar',
  },
];

// Art alternativa para placeholders premium sin foto real.
function ArtAmber() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[hsl(30,15%,10%)] to-[hsl(28,20%,6%)]">
      {/* Frasco silueta SVG ámbar */}
      <svg
        viewBox="0 0 200 280"
        className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_40px_hsl(32_70%_50%/0.45)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="amberBody" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(32 70% 35%)" />
            <stop offset="55%" stopColor="hsl(28 75% 22%)" />
            <stop offset="100%" stopColor="hsl(20 80% 12%)" />
          </linearGradient>
          <radialGradient id="amberGlow" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0%" stopColor="hsl(40 90% 60%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(32 80% 40%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Cuello */}
        <rect x="80" y="22" width="40" height="40" fill="url(#amberBody)" />
        {/* Cuerpo */}
        <path
          d="M55 62 Q 55 56 65 56 L135 56 Q 145 56 145 62 L 145 240 Q 145 260 125 260 L 75 260 Q 55 260 55 240 Z"
          fill="url(#amberBody)"
        />
        {/* Glow interno */}
        <ellipse cx="100" cy="160" rx="50" ry="80" fill="url(#amberGlow)" />
        {/* Label */}
        <rect
          x="68"
          y="130"
          width="64"
          height="40"
          fill="hsl(30 10% 8%)"
          stroke="hsl(32 55% 60%)"
          strokeOpacity="0.6"
          strokeWidth="0.5"
        />
        <text
          x="100"
          y="155"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="9"
          fill="hsl(32 55% 60%)"
          letterSpacing="2"
        >
          EUDROMIA
        </text>
        {/* Highlight */}
        <path
          d="M65 70 Q 60 130 75 230"
          stroke="hsl(40 90% 80%)"
          strokeWidth="3"
          strokeOpacity="0.35"
          fill="none"
        />
      </svg>
    </div>
  );
}

function ArtMortar() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[hsl(30,15%,9%)] to-[hsl(28,20%,5%)]">
      <svg
        viewBox="0 0 240 240"
        className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_hsl(32_70%_50%/0.35)]"
        aria-hidden
      >
        <defs>
          <radialGradient id="bowlGlow" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0%" stopColor="hsl(32 70% 50%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(32 70% 50%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Glow */}
        <circle cx="120" cy="150" r="95" fill="url(#bowlGlow)" />
        {/* Mortero */}
        <ellipse
          cx="120"
          cy="160"
          rx="85"
          ry="22"
          fill="none"
          stroke="hsl(32 50% 55%)"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <path
          d="M40 160 Q 50 220 120 222 Q 190 220 200 160"
          fill="none"
          stroke="hsl(32 50% 55%)"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <ellipse
          cx="120"
          cy="160"
          rx="68"
          ry="14"
          fill="hsl(30 25% 18%)"
          fillOpacity="0.7"
        />
        {/* Pestle */}
        <line
          x1="80"
          y1="60"
          x2="120"
          y2="160"
          stroke="hsl(32 50% 55%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="78" cy="58" r="8" fill="hsl(32 50% 55%)" />
        {/* Hojas decorativas */}
        <g stroke="hsl(32 55% 60%)" strokeWidth="1" fill="none" strokeOpacity="0.75">
          <path d="M20 100 Q 30 80 45 95 Q 35 110 20 100 Z" />
          <path d="M195 100 Q 210 80 220 100 Q 210 115 195 100 Z" />
          <path d="M30 200 Q 45 195 50 210 Q 35 215 30 200 Z" />
          <path d="M190 200 Q 205 195 210 210 Q 195 215 190 200 Z" />
        </g>
        {/* Puntos botánicos */}
        <g fill="hsl(32 60% 60%)" fillOpacity="0.8">
          <circle cx="100" cy="155" r="1.5" />
          <circle cx="130" cy="153" r="1.2" />
          <circle cx="115" cy="158" r="1.5" />
          <circle cx="142" cy="156" r="1" />
        </g>
      </svg>
    </div>
  );
}

export function SectionCollection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.col-title-line', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.col-title',
          start: 'top 82%',
        },
      });

      gsap.from('.col-sub', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.col-title',
          start: 'top 80%',
        },
      });

      gsap.from('.col-item', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: '.col-grid',
          start: 'top 75%',
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="coleccion"
      className="relative isolate overflow-hidden border-b border-border/30 py-24 sm:py-32"
      aria-labelledby="collection-title"
    >
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="col-title text-center">
          <h2
            id="collection-title"
            className="font-display text-[clamp(1.5rem,3.6vw,2.5rem)] font-medium uppercase tracking-[0.18em] text-foreground"
          >
            <span className="col-title-line block">Nuestra colección</span>
            <span className="col-title-line block text-brand">botánica.</span>
          </h2>
          <p className="col-sub mt-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Exclusivamente para nuestros miembros selectos
          </p>
        </div>

        <ul className="col-grid mt-16 grid gap-8 md:grid-cols-3">
          {ITEMS.map((item) => (
            <li key={item.id} className="col-item">
              <OrnateFrame className="group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  {item.kind === 'image' && item.image && item.alt ? (
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : item.kind === 'art-amber' ? (
                    <ArtAmber />
                  ) : (
                    <ArtMortar />
                  )}
                  {/* Vignette en imagen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                <div className="px-4 pb-4 pt-6 text-center">
                  <h3 className="font-display text-sm font-medium uppercase tracking-[0.28em] text-brand">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </OrnateFrame>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
