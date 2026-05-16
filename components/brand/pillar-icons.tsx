import { cn } from '@/lib/cn';

// Arco gótico decorativo que contiene cada icono. Stroke fino,
// estilo etching, optimizado para alinear los 3 pilares.
function GothicArch({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('text-brand', className)}
    >
      {/* Marco exterior */}
      <path d="M20 156 L20 80 Q 20 20 60 20 Q 100 20 100 80 L 100 156" strokeOpacity="0.65" />
      <path d="M28 152 L28 82 Q 28 30 60 30 Q 92 30 92 82 L 92 152" strokeOpacity="0.3" />

      {/* Adornos esquinas inferiores */}
      <path d="M18 156 L102 156" strokeOpacity="0.7" />
      <path d="M16 158 L104 158" strokeOpacity="0.35" />
      <circle cx="20" cy="156" r="1.5" fill="currentColor" />
      <circle cx="100" cy="156" r="1.5" fill="currentColor" />

      {/* Decoración keystone arriba */}
      <path d="M55 22 L60 16 L65 22" strokeOpacity="0.65" />

      {/* Contenido central */}
      <g transform="translate(60 90)">{children}</g>
    </svg>
  );
}

// Icono 1 — Curaduría Genética (planta de cannabis estilizada simétrica)
export function PillarCuracion({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Tallo */}
      <line x1="0" y1="35" x2="0" y2="-30" strokeOpacity="0.9" />
      {/* Hojas (par superior, medio, inferior) */}
      <g strokeOpacity="0.9">
        <path d="M0 -25 C -10 -28, -22 -22, -28 -10 C -18 -16, -8 -22, 0 -25 Z" />
        <path d="M0 -25 C 10 -28, 22 -22, 28 -10 C 18 -16, 8 -22, 0 -25 Z" />
      </g>
      <g strokeOpacity="0.75">
        <path d="M0 -10 C -12 -14, -25 -8, -30 6 C -20 0, -10 -6, 0 -10 Z" />
        <path d="M0 -10 C 12 -14, 25 -8, 30 6 C 20 0, 10 -6, 0 -10 Z" />
      </g>
      <g strokeOpacity="0.6">
        <path d="M0 6 C -10 4, -20 8, -24 18 C -16 14, -8 12, 0 6 Z" />
        <path d="M0 6 C 10 4, 20 8, 24 18 C 16 14, 8 12, 0 6 Z" />
      </g>
      {/* Cogollo (puntos) */}
      <circle cx="0" cy="-30" r="2" fill="currentColor" />
      <circle cx="-3" cy="-26" r="1" fill="currentColor" />
      <circle cx="3" cy="-26" r="1" fill="currentColor" />
    </GothicArch>
  );
}

// Icono 2 — Guía Personalizada (rosa de los vientos)
export function PillarGuia({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Círculos concéntricos */}
      <circle cx="0" cy="0" r="26" strokeOpacity="0.55" />
      <circle cx="0" cy="0" r="20" strokeOpacity="0.35" />
      {/* Cuatro puntas cardinales (rombos alargados) */}
      <g>
        <path d="M0 -28 L 5 0 L 0 28 L -5 0 Z" strokeOpacity="0.9" />
        <path d="M-28 0 L 0 -5 L 28 0 L 0 5 Z" strokeOpacity="0.9" />
      </g>
      {/* Puntas diagonales más sutiles */}
      <g strokeOpacity="0.55">
        <path d="M-18 -18 L 0 -3 L 18 -18 L 3 0 Z" />
        <path d="M-18 18 L 0 3 L 18 18 L -3 0 Z" />
      </g>
      {/* Estrella central */}
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <circle cx="0" cy="0" r="5" strokeOpacity="0.6" />
      {/* Marcas de grado */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="0"
          y1="-26"
          x2="0"
          y2="-23"
          transform={`rotate(${deg})`}
          strokeOpacity="0.6"
        />
      ))}
    </GothicArch>
  );
}

// Icono 3 — El Santuario Privado (llave ornamental)
export function PillarSantuario({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Cabeza de la llave (trébol/quatrefoil) */}
      <circle cx="0" cy="-18" r="11" strokeOpacity="0.9" />
      <circle cx="0" cy="-18" r="6" strokeOpacity="0.6" />
      {/* Cuatro pequeñas perforaciones cardinales en la cabeza */}
      <circle cx="0" cy="-26" r="2" strokeOpacity="0.7" />
      <circle cx="0" cy="-10" r="2" strokeOpacity="0.7" />
      <circle cx="-8" cy="-18" r="2" strokeOpacity="0.7" />
      <circle cx="8" cy="-18" r="2" strokeOpacity="0.7" />
      {/* Caña */}
      <line x1="0" y1="-7" x2="0" y2="22" strokeOpacity="0.9" />
      {/* Dientes */}
      <line x1="0" y1="14" x2="8" y2="14" strokeOpacity="0.9" />
      <line x1="0" y1="18" x2="6" y2="18" strokeOpacity="0.9" />
      <line x1="0" y1="22" x2="10" y2="22" strokeOpacity="0.9" />
      {/* Punto final */}
      <circle cx="0" cy="22" r="1.5" fill="currentColor" />
    </GothicArch>
  );
}
