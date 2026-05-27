'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/animations';

// Video en loop, muteado, que sólo reproduce cuando entra en viewport (ahorra
// datos/batería) y respeta prefers-reduced-motion (deja el poster quieto).
// Genérico: el padre define tamaño y object-fit vía className.
export function LoopVideo({
  src,
  poster,
  className,
  ariaLabel,
}: {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
    />
  );
}
