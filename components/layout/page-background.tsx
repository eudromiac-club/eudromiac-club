'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Fondo de página responsive: imagen distinta para mobile y desktop, fija
// detrás del contenido (-z-10, sobre el bg del body). El overlay es un velo
// para mantener legible el texto del tema oscuro sobre la foto. Con `parallax`
// la foto hace un zoom sutil ligado al scroll (scrub).
export function PageBackground({
  mobileSrc,
  webSrc,
  overlayClassName,
  overlayStyle,
  priority,
  parallax,
}: {
  mobileSrc: string;
  webSrc: string;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  priority?: boolean;
  parallax?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!parallax || prefersReducedMotion()) return;
      gsap.to('.pgbg-layer', {
        scale: 1.16,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });
    },
    { scope: root, dependencies: [parallax] },
  );

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="pgbg-layer absolute inset-0 will-change-transform">
        <Image
          src={mobileSrc}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src={webSrc}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="hidden object-cover md:block"
        />
      </div>
      {(overlayClassName || overlayStyle) && (
        <div className={cn('absolute inset-0', overlayClassName)} style={overlayStyle} />
      )}
    </div>
  );
}
