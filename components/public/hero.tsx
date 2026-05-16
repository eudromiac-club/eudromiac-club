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
        {/* Sparkles SVG */}
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <radialGradient id="spark">
              <stop offset="0%" stopColor="hsl(32 80% 65%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(32 80% 65%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[
            [120, 200, 4],
            [320, 120, 2.5],
            [520, 80, 3.5],
            [780, 180, 2],
            [980, 260, 3],
            [1080, 520, 2.5],
            [880, 680, 4],
            [580, 720, 3],
            [220, 640, 2],
            [60, 460, 3],
            [400, 560, 1.5],
            [720, 460, 2],
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
            <Link href="/login">Solicitar acceso</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
