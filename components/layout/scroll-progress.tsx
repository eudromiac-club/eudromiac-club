'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Barra fina dorada arriba de todo que se llena a medida que se scrollea.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left"
      style={{
        background:
          'linear-gradient(to right, hsl(var(--brand) / 0.2), hsl(var(--brand)), hsl(48 90% 72%))',
        boxShadow: '0 0 10px hsl(var(--brand) / 0.55)',
      }}
    />
  );
}
