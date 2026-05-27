'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/animations';

// Video loop de la interna. Muted + playsInline para poder autoreproducir en
// mobile, con el poster (PNG de la genética) mostrándose al instante. Sólo
// reproduce cuando entra en viewport (ahorra datos/batería) y respeta
// prefers-reduced-motion dejando el poster quieto. Si el video falla, cae al
// poster como imagen.
export function GeneticVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string | null;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

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

  if (failed && poster) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      aria-label={alt}
    />
  );
}
