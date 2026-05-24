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
    label: 'Extractos de Autor',
    body: 'Concentrados botánicos de la más alta pureza, capturando la esencia de la planta en su estado más cristalino.',
    kind: 'image',
    image: '/home/4.png',
    alt: 'Extracto de autor EUDROMIA — composición botánica',
  },
  {
    id: 'formulas',
    label: 'Fórmulas Magistrales',
    body: 'Mezclas personalizadas y aceites medicinales desarrollados con respeto por la herencia herbolaria.',
    kind: 'image',
    image: '/home/3.png',
    alt: 'Fórmula magistral EUDROMIA — aceite medicinal',
  },
];

// Art alternativa para placeholders premium sin foto real.
function ArtAmber() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,hsl(32_30%_18%/0.7),hsl(28_20%_8%)_60%)]">
      {/* Halo trasero */}
      <div
        className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(40 80% 50% / 0.5), transparent 65%)',
          filter: 'blur(40px)',
        }}
        aria-hidden
      />
      {/* Frasco silueta SVG ámbar con label ornamental */}
      <svg
        viewBox="0 0 220 320"
        className="absolute left-1/2 top-1/2 h-[88%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_50px_hsl(32_80%_50%/0.55)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="amberBody" x1="0.3" x2="0.7" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(36 80% 45%)" />
            <stop offset="30%" stopColor="hsl(30 80% 32%)" />
            <stop offset="65%" stopColor="hsl(24 75% 22%)" />
            <stop offset="100%" stopColor="hsl(20 75% 12%)" />
          </linearGradient>
          <radialGradient id="amberGlow" cx="0.5" cy="0.55" r="0.55">
            <stop offset="0%" stopColor="hsl(44 95% 70%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(32 80% 40%)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="capGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(32 35% 25%)" />
            <stop offset="100%" stopColor="hsl(28 30% 14%)" />
          </linearGradient>
        </defs>

        {/* Tapón superior con anillos */}
        <g>
          <rect x="78" y="6" width="64" height="14" rx="2" fill="url(#capGrad)" />
          <line x1="78" y1="10" x2="142" y2="10" stroke="hsl(32 55% 65%)" strokeOpacity="0.3" />
          <line x1="78" y1="16" x2="142" y2="16" stroke="hsl(32 55% 65%)" strokeOpacity="0.2" />
          <rect x="84" y="20" width="52" height="22" fill="url(#capGrad)" />
          <line x1="84" y1="28" x2="136" y2="28" stroke="hsl(32 55% 65%)" strokeOpacity="0.25" />
        </g>

        {/* Cuello */}
        <path d="M88 42 L 88 60 L 132 60 L 132 42 Z" fill="url(#amberBody)" />
        <path d="M88 42 L 88 60 L 132 60 L 132 42" fill="none" stroke="hsl(32 80% 70%)" strokeOpacity="0.25" />

        {/* Cuerpo */}
        <path
          d="M60 64 Q 60 60 66 60 L 154 60 Q 160 60 160 64 L 160 282 Q 160 304 138 304 L 82 304 Q 60 304 60 282 Z"
          fill="url(#amberBody)"
        />
        {/* Glow interno */}
        <ellipse cx="110" cy="180" rx="58" ry="92" fill="url(#amberGlow)" />

        {/* Highlight vertical izquierdo (reflejo de luz) */}
        <path
          d="M72 80 Q 64 180 80 280"
          stroke="hsl(48 95% 85%)"
          strokeWidth="4"
          strokeOpacity="0.35"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight derecho más fino */}
        <path
          d="M148 100 Q 152 200 142 290"
          stroke="hsl(48 95% 85%)"
          strokeWidth="2"
          strokeOpacity="0.2"
          fill="none"
        />

        {/* Label rectangular ornamental */}
        <g>
          <rect
            x="74"
            y="150"
            width="72"
            height="90"
            fill="hsl(36 25% 10%)"
            stroke="hsl(32 55% 65%)"
            strokeOpacity="0.7"
            strokeWidth="0.6"
          />
          <rect
            x="78"
            y="154"
            width="64"
            height="82"
            fill="none"
            stroke="hsl(32 55% 65%)"
            strokeOpacity="0.35"
            strokeWidth="0.4"
          />
          {/* Ornamentos esquinas label */}
          <g stroke="hsl(32 55% 65%)" strokeOpacity="0.7" strokeWidth="0.5" fill="none">
            <path d="M76 152 L 80 152 L 80 156" />
            <path d="M144 152 L 140 152 L 140 156" />
            <path d="M76 238 L 80 238 L 80 234" />
            <path d="M144 238 L 140 238 L 140 234" />
          </g>
          {/* Línea decorativa superior label */}
          <line x1="86" y1="166" x2="134" y2="166" stroke="hsl(32 55% 65%)" strokeOpacity="0.4" strokeWidth="0.4" />
          <line x1="100" y1="170" x2="120" y2="170" stroke="hsl(32 55% 65%)" strokeOpacity="0.7" strokeWidth="0.4" />
          {/* Nombre EUDROMIA */}
          <text
            x="110"
            y="190"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="11"
            fill="hsl(32 60% 70%)"
            letterSpacing="2.5"
            fontWeight="500"
          >
            EUDROMIA
          </text>
          {/* CLUB */}
          <text
            x="110"
            y="205"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="6"
            fill="hsl(32 55% 60%)"
            letterSpacing="3"
          >
            · CLUB ·
          </text>
          {/* Línea decorativa inferior */}
          <line x1="100" y1="214" x2="120" y2="214" stroke="hsl(32 55% 65%)" strokeOpacity="0.7" strokeWidth="0.4" />
          {/* Tipo de extracto */}
          <text
            x="110"
            y="225"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="4.5"
            fill="hsl(32 45% 55%)"
            letterSpacing="2"
          >
            EXTRACTO PURO
          </text>
        </g>

        {/* Sombra inferior */}
        <ellipse cx="110" cy="310" rx="55" ry="3" fill="black" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

function ArtMortar() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,hsl(32_30%_15%/0.6),hsl(28_20%_7%)_65%)]">
      {/* Halo trasero */}
      <div
        className="absolute left-1/2 top-[58%] h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(32 70% 45% / 0.45), transparent 65%)',
          filter: 'blur(35px)',
        }}
        aria-hidden
      />
      <svg
        viewBox="0 0 260 320"
        className="absolute left-1/2 top-1/2 h-[92%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_40px_hsl(32_70%_50%/0.4)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="mortarBody" x1="0.3" x2="0.7" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(32 50% 55%)" />
            <stop offset="50%" stopColor="hsl(30 45% 35%)" />
            <stop offset="100%" stopColor="hsl(26 40% 20%)" />
          </linearGradient>
          <radialGradient id="bowlInner" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="hsl(28 30% 22%)" />
            <stop offset="100%" stopColor="hsl(24 30% 8%)" />
          </radialGradient>
        </defs>

        {/* Mano del mortero (pestle) inclinada */}
        <g>
          {/* Cuerpo del mano */}
          <line
            x1="60"
            y1="60"
            x2="130"
            y2="195"
            stroke="url(#mortarBody)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Highlight */}
          <line
            x1="58"
            y1="64"
            x2="128"
            y2="198"
            stroke="hsl(40 70% 70%)"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          {/* Cabeza del pestle */}
          <circle cx="56" cy="56" r="11" fill="url(#mortarBody)" />
          <circle cx="54" cy="54" r="3" fill="hsl(40 70% 80%)" fillOpacity="0.5" />
        </g>

        {/* Mortero (bowl) */}
        <g>
          {/* Borde superior */}
          <ellipse
            cx="135"
            cy="200"
            rx="105"
            ry="22"
            fill="hsl(28 30% 12%)"
            stroke="hsl(32 50% 55%)"
            strokeWidth="1.4"
            strokeOpacity="0.9"
          />
          {/* Interior del bowl (oscuridad) */}
          <ellipse
            cx="135"
            cy="200"
            rx="92"
            ry="14"
            fill="url(#bowlInner)"
          />
          {/* Cuerpo del bowl */}
          <path
            d="M30 200 Q 40 295 135 297 Q 230 295 240 200"
            fill="url(#mortarBody)"
            stroke="hsl(32 55% 60%)"
            strokeWidth="1.4"
            strokeOpacity="0.85"
          />
          {/* Banda decorativa horizontal */}
          <path
            d="M40 230 Q 60 245 135 248 Q 210 245 230 230"
            fill="none"
            stroke="hsl(32 55% 65%)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          {/* Decoración tipo etching alrededor */}
          <g stroke="hsl(32 55% 60%)" strokeOpacity="0.35" strokeWidth="0.5" fill="none">
            <path d="M50 250 Q 60 258 70 250" />
            <path d="M75 258 Q 85 266 95 258" />
            <path d="M100 264 Q 110 272 120 264" />
            <path d="M150 264 Q 160 272 170 264" />
            <path d="M175 258 Q 185 266 195 258" />
            <path d="M200 250 Q 210 258 220 250" />
          </g>
          {/* Highlight izquierdo del bowl */}
          <path
            d="M40 220 Q 38 260 50 285"
            stroke="hsl(40 70% 70%)"
            strokeWidth="2.5"
            strokeOpacity="0.35"
            fill="none"
          />
        </g>

        {/* Polvo/hierbas dentro del bowl (puntos botánicos) */}
        <g fill="hsl(32 65% 55%)" fillOpacity="0.85">
          <circle cx="100" cy="200" r="1.8" />
          <circle cx="118" cy="197" r="1.2" />
          <circle cx="135" cy="199" r="2" />
          <circle cx="152" cy="196" r="1.5" />
          <circle cx="170" cy="201" r="1.2" />
          <circle cx="80" cy="203" r="1" />
          <circle cx="190" cy="203" r="1" />
          <circle cx="143" cy="195" r="0.8" />
          <circle cx="125" cy="203" r="0.8" />
        </g>

        {/* Hojas decorativas alrededor (más detalladas) */}
        <g stroke="hsl(32 55% 60%)" fill="none" strokeOpacity="0.8" strokeWidth="0.9">
          {/* Hoja superior izquierda */}
          <g transform="translate(15 80)">
            <path d="M0 0 Q 8 -15 24 -8 Q 22 8 6 12 Q 0 8 0 0 Z" />
            <line x1="0" y1="0" x2="20" y2="-4" strokeOpacity="0.45" />
            <line x1="6" y1="6" x2="20" y2="-2" strokeOpacity="0.35" />
          </g>
          {/* Hoja superior derecha */}
          <g transform="translate(245 80) scale(-1 1)">
            <path d="M0 0 Q 8 -15 24 -8 Q 22 8 6 12 Q 0 8 0 0 Z" />
            <line x1="0" y1="0" x2="20" y2="-4" strokeOpacity="0.45" />
            <line x1="6" y1="6" x2="20" y2="-2" strokeOpacity="0.35" />
          </g>
          {/* Ramas finas con bayas */}
          <g transform="translate(20 130)">
            <path d="M0 0 Q 10 10 22 8" />
            <circle cx="18" cy="6" r="1.3" fill="hsl(32 65% 55%)" fillOpacity="0.7" stroke="none" />
            <circle cx="22" cy="9" r="1" fill="hsl(32 65% 55%)" fillOpacity="0.7" stroke="none" />
          </g>
          <g transform="translate(240 130) scale(-1 1)">
            <path d="M0 0 Q 10 10 22 8" />
            <circle cx="18" cy="6" r="1.3" fill="hsl(32 65% 55%)" fillOpacity="0.7" stroke="none" />
            <circle cx="22" cy="9" r="1" fill="hsl(32 65% 55%)" fillOpacity="0.7" stroke="none" />
          </g>
        </g>

        {/* Sombra inferior */}
        <ellipse cx="135" cy="305" rx="100" ry="3" fill="black" fillOpacity="0.5" />
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
        immediateRender: false,
        scrollTrigger: {
          trigger: '.col-title',
          start: 'top 90%',
          once: true,
        },
      });

      gsap.from('.col-sub', {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.col-title',
          start: 'top 90%',
          once: true,
        },
      });

      gsap.from('.col-item', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.22,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.col-grid',
          start: 'top 90%',
          once: true,
        },
      });

      // Parallax interno por card: la imagen/art se desplaza a velocidad
      // ligeramente distinta del marco al hacer scroll → profundidad sin
      // perder la cuadrícula.
      gsap.utils.toArray<HTMLElement>('.col-item').forEach((item, i) => {
        const content = item.querySelector<HTMLElement>('.col-photo');
        if (!content) return;
        gsap.fromTo(
          content,
          { yPercent: -3 },
          {
            yPercent: 3 + i * 1.5,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          },
        );
      });

      const timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(timeout);
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
                <div className="col-photo relative aspect-[686/992] overflow-hidden bg-[hsl(28_20%_6%)]">
                  {item.kind === 'image' && item.image && item.alt ? (
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 686px, (min-width: 768px) 33vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : item.kind === 'art-amber' ? (
                    <ArtAmber />
                  ) : (
                    <ArtMortar />
                  )}
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
