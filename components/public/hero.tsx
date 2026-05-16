'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';
import { Emblem } from '@/components/brand/emblem';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-emblem', {
        opacity: 0,
        scale: 0.85,
        rotation: -8,
        duration: 1.4,
        ease: 'power4.out',
      })
        .from(
          '.hero-name-letter',
          {
            yPercent: 110,
            opacity: 0,
            stagger: 0.04,
            duration: 0.9,
            ease: 'power4.out',
          },
          '-=0.9',
        )
        .from(
          '.hero-club',
          { opacity: 0, letterSpacing: '1em', duration: 1, ease: 'power2.out' },
          '-=0.6',
        )
        .from(
          '.hero-rule',
          { scaleX: 0, transformOrigin: 'center', duration: 0.7 },
          '-=0.4',
        )
        .from(
          '.hero-headline-line',
          { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
          '-=0.4',
        )
        .from('.hero-lede', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.hero-cta', { y: 14, opacity: 0, duration: 0.6 }, '-=0.4');

      // Glow pulsante del emblema (loop)
      gsap.to('.hero-emblem', {
        filter: 'drop-shadow(0 0 32px hsl(var(--brand) / 0.65))',
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Parallax sutil del fondo al scroll
      gsap.to('.hero-bg', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Drift muy lento del aura para que no quede estático
      gsap.to('.hero-aura', {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: 'none',
      });
    },
    { scope: root },
  );

  const NAME = 'EUDROMIA'.split('');

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden border-b border-border/30"
      aria-labelledby="hero-headline"
    >
      {/* Background art (CSS + SVG) */}
      <div className="hero-bg absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 35%, hsl(32 55% 35% / 0.45), transparent 60%), radial-gradient(circle at 80% 80%, hsl(32 70% 50% / 0.25), transparent 50%), radial-gradient(circle at 15% 20%, hsl(32 70% 50% / 0.18), transparent 50%), hsl(var(--background))',
          }}
        />
        {/* Aura giratoria sutil */}
        <div
          className="hero-aura absolute left-1/2 top-[42%] -z-10 h-[160vmin] w-[160vmin] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{
            background:
              'conic-gradient(from 0deg, transparent, hsl(32 80% 55% / 0.18), transparent 30%, transparent 60%, hsl(32 80% 55% / 0.12), transparent)',
            filter: 'blur(60px)',
          }}
          aria-hidden
        />
        {/* Cristales/tricomas: clusters de gotas doradas que simulan el
            macro del moodboard. Mezcla tamaños, blur y opacidad. */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <radialGradient id="cryst-bright" cx="0.35" cy="0.3" r="0.7">
              <stop offset="0%" stopColor="hsl(48 95% 85%)" stopOpacity="1" />
              <stop offset="40%" stopColor="hsl(38 90% 60%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(28 80% 30%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cryst-warm" cx="0.4" cy="0.35" r="0.7">
              <stop offset="0%" stopColor="hsl(40 85% 65%)" stopOpacity="0.9" />
              <stop offset="60%" stopColor="hsl(32 70% 40%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(28 60% 20%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="spark">
              <stop offset="0%" stopColor="hsl(48 95% 88%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(48 95% 88%)" stopOpacity="0" />
            </radialGradient>
            <filter id="crystblur">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* Cluster grande izquierda */}
          <g opacity="0.85">
            <circle cx="120" cy="180" r="55" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="80" cy="220" r="34" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="180" cy="240" r="42" fill="url(#cryst-bright)" filter="url(#crystblur)" />
            <circle cx="140" cy="280" r="22" fill="url(#cryst-bright)" />
            <circle cx="200" cy="180" r="18" fill="url(#cryst-bright)" />
            <circle cx="60" cy="160" r="14" fill="url(#cryst-warm)" />
          </g>

          {/* Cluster centro alto */}
          <g opacity="0.7">
            <circle cx="600" cy="80" r="38" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="540" cy="110" r="20" fill="url(#cryst-bright)" />
            <circle cx="660" cy="130" r="24" fill="url(#cryst-bright)" />
            <circle cx="720" cy="60" r="14" fill="url(#cryst-warm)" />
          </g>

          {/* Cluster grande derecha */}
          <g opacity="0.8">
            <circle cx="1050" cy="250" r="58" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="1100" cy="200" r="30" fill="url(#cryst-bright)" filter="url(#crystblur)" />
            <circle cx="980" cy="180" r="22" fill="url(#cryst-bright)" />
            <circle cx="1120" cy="290" r="18" fill="url(#cryst-warm)" />
            <circle cx="950" cy="260" r="14" fill="url(#cryst-bright)" />
          </g>

          {/* Cluster inferior izquierda */}
          <g opacity="0.75">
            <circle cx="180" cy="640" r="48" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="120" cy="700" r="26" fill="url(#cryst-bright)" />
            <circle cx="240" cy="680" r="20" fill="url(#cryst-bright)" />
            <circle cx="80" cy="640" r="14" fill="url(#cryst-warm)" />
          </g>

          {/* Cluster inferior derecha */}
          <g opacity="0.8">
            <circle cx="970" cy="680" r="52" fill="url(#cryst-warm)" filter="url(#crystblur)" />
            <circle cx="1080" cy="640" r="28" fill="url(#cryst-bright)" filter="url(#crystblur)" />
            <circle cx="900" cy="640" r="20" fill="url(#cryst-bright)" />
            <circle cx="1040" cy="720" r="16" fill="url(#cryst-warm)" />
          </g>

          {/* Puntos pequeños dispersos */}
          {[
            [320, 380, 4],
            [380, 420, 2.5],
            [820, 340, 5],
            [880, 400, 3],
            [460, 540, 2],
            [720, 580, 3.5],
            [550, 360, 2],
            [640, 480, 2.5],
            [400, 240, 1.8],
            [780, 200, 2],
            [260, 480, 2.5],
            [840, 540, 2],
            [500, 660, 3],
            [620, 700, 2],
            [340, 720, 1.5],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="url(#spark)" />
          ))}
        </svg>
        <div className="grain absolute inset-0" />
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, hsl(var(--background) / 0.85) 100%)',
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-4xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        {/* Logo lockup grande */}
        <div className="flex flex-col items-center">
          <Emblem
            className="hero-emblem h-20 w-20 sm:h-24 sm:w-24"
            style={{ filter: 'drop-shadow(0 0 24px hsl(var(--brand) / 0.45))' }}
          />
          <div className="mt-5 overflow-hidden">
            <h2 className="font-display text-3xl font-medium tracking-[0.18em] text-foreground sm:text-4xl">
              {NAME.map((ch, i) => (
                <span
                  key={i}
                  className="hero-name-letter inline-block"
                  style={{ willChange: 'transform' }}
                >
                  {ch}
                </span>
              ))}
            </h2>
          </div>
          <p className="hero-club mt-1.5 font-display text-sm tracking-[0.55em] text-brand sm:text-base">
            CLUB
          </p>
        </div>

        <div className="hero-rule h-px w-32 bg-gradient-to-r from-transparent via-brand to-transparent" />

        <div>
          <h1
            id="hero-headline"
            className="text-balance font-display text-[clamp(2rem,6vw,3.75rem)] font-medium uppercase leading-[1.05] tracking-[0.04em]"
          >
            <span className="hero-headline-line block">La alquimia</span>
            <span className="hero-headline-line block text-brand">del bienestar.</span>
          </h1>
          <p className="hero-lede mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curaduría botánica y guía privada para el viaje hacia el equilibrio.
          </p>
        </div>

        <div className="hero-cta">
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
