'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { OrnateFrame } from '@/components/brand/ornate-frame';
import { LoopVideo } from '@/components/brand/loop-video';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SectionExtractosTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.ext-reveal', {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="extractos"
      className="relative isolate overflow-hidden border-b border-border/30 py-24 sm:py-32"
      aria-labelledby="extractos-title"
    >
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="ext-reveal inline-block rounded-full border border-brand/50 bg-brand/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-brand">
          Próximamente
        </span>

        <h2
          id="extractos-title"
          className="ext-reveal mt-6 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-medium uppercase tracking-[0.12em] text-foreground"
        >
          Extractos <span className="text-brand">de autor</span>
        </h2>

        <p className="ext-reveal mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
          Concentrados botánicos de la más alta pureza, capturando la esencia de
          la planta en su estado más cristalino. Sumamos hash y extractos a la
          curaduría muy pronto.
        </p>

        <div className="ext-reveal mx-auto mt-12 max-w-md">
          <OrnateFrame>
            <div className="relative aspect-[1104/832] overflow-hidden bg-[#f4ede1]">
              <LoopVideo
                src="/brand/hash.mp4"
                poster="/brand/hash-poster.jpg"
                ariaLabel="Hash artesanal EUDROMIA"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </OrnateFrame>
        </div>
      </div>
    </section>
  );
}
