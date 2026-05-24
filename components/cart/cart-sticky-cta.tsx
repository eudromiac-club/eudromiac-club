'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animations';

export function CartStickyCta({
  itemCount,
  totalCents,
}: {
  itemCount: number;
  totalCents: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion()) return;

    const justAdded = itemCount > prevCount.current;
    const justAppeared = prevCount.current === 0 && itemCount > 0;
    prevCount.current = itemCount;

    if (itemCount > 0 && justAppeared) {
      gsap.fromTo(
        ref.current,
        { y: 120, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' },
      );
    } else if (justAdded && ref.current) {
      const btn = ref.current.querySelector<HTMLElement>('.cta-btn');
      if (btn) {
        gsap.fromTo(
          btn,
          { scale: 1 },
          { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' },
        );
      }
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  const total = (totalCents / 100).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 sm:pb-8"
    >
      <Link
        href="/carrito"
        className="cta-btn pointer-events-auto group relative flex w-full max-w-md items-center justify-between gap-4 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 px-6 py-4 text-white shadow-[0_25px_60px_-15px_rgba(16,185,129,0.7),0_0_40px_-5px_rgba(16,185,129,0.4)] transition-transform duration-200 hover:scale-[1.03] sm:px-8 sm:py-5"
      >
        {/* Halo pulsante detrás */}
        <span
          className="pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-full bg-emerald-400/40 blur-2xl"
          aria-hidden
        />
        {/* Brillo que cruza el botón en hover */}
        <span
          className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-full"
          aria-hidden
        />

        <span className="relative flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-mono text-sm font-bold text-emerald-700 shadow-inner">
            {itemCount}
          </span>
          <span className="font-display text-base font-medium uppercase tracking-[0.18em] sm:text-lg">
            Ir a pagar
          </span>
        </span>

        <span className="relative flex items-center gap-2">
          <span className="font-mono text-sm tabular-nums sm:text-base">{total}</span>
          <span className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </div>
  );
}
