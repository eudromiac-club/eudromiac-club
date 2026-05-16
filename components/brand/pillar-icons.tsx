import { cn } from '@/lib/cn';

// Arco contenedor con mucho más detalle ornamental: keystone con
// flourish triple, columnas con base/capitel, dobles líneas concéntricas,
// flecos en la corona. Stroke cobre, dos pesos para profundidad.
function GothicArch({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 140 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('text-brand', className)}
    >
      {/* Base decorativa horizontal */}
      <g strokeOpacity="0.75">
        <line x1="10" y1="190" x2="130" y2="190" />
        <line x1="6" y1="194" x2="134" y2="194" strokeOpacity="0.4" />
        <line x1="14" y1="186" x2="126" y2="186" strokeOpacity="0.5" />
      </g>
      {/* Capiteles izq/der */}
      <g strokeOpacity="0.7">
        <line x1="18" y1="186" x2="18" y2="178" />
        <line x1="26" y1="186" x2="26" y2="178" />
        <line x1="14" y1="178" x2="30" y2="178" />
        <line x1="114" y1="186" x2="114" y2="178" />
        <line x1="122" y1="186" x2="122" y2="178" />
        <line x1="110" y1="178" x2="126" y2="178" />
      </g>
      {/* Columnas */}
      <g strokeOpacity="0.55">
        <line x1="22" y1="178" x2="22" y2="86" />
        <line x1="118" y1="178" x2="118" y2="86" />
      </g>
      {/* Arco ojival doble */}
      <path d="M22 86 Q 22 24 70 14 Q 118 24 118 86" strokeOpacity="0.85" />
      <path d="M28 86 Q 28 34 70 24 Q 112 34 112 86" strokeOpacity="0.35" />
      {/* Keystone con flourish triple */}
      <g strokeOpacity="0.85">
        <path d="M62 22 L70 10 L78 22" />
        <circle cx="70" cy="8" r="2" fill="currentColor" />
        <path d="M66 18 L70 13 L74 18" strokeOpacity="0.55" />
      </g>
      {/* Hojas/ornamentos en los hombros del arco */}
      <g strokeOpacity="0.55">
        <path d="M22 86 Q 12 78 12 70 Q 18 74 22 80" />
        <path d="M118 86 Q 128 78 128 70 Q 122 74 118 80" />
        <path d="M22 100 Q 12 96 10 90" strokeOpacity="0.4" />
        <path d="M118 100 Q 128 96 130 90" strokeOpacity="0.4" />
      </g>
      {/* Ornamentos verticales (filigrana en los laterales del arco) */}
      <g strokeOpacity="0.4">
        <line x1="34" y1="38" x2="40" y2="44" />
        <line x1="100" y1="38" x2="106" y2="44" />
        <line x1="40" y1="36" x2="46" y2="42" />
        <line x1="94" y1="36" x2="100" y2="42" />
      </g>
      {/* Marcos esquineros */}
      <g strokeOpacity="0.75" fill="currentColor">
        <circle cx="10" cy="190" r="1.5" />
        <circle cx="130" cy="190" r="1.5" />
      </g>
      {/* Contenido central */}
      <g transform="translate(70 110)">{children}</g>
    </svg>
  );
}

// Icono 1 — Curaduría Genética (planta de cannabis simétrica frontal,
// más detallada: 7 hojas, tallo central, cogollos visibles, ramas finas)
export function PillarCuracion({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Tallo central */}
      <line x1="0" y1="55" x2="0" y2="-55" strokeOpacity="0.9" />
      {/* Nudos del tallo */}
      <g strokeOpacity="0.6" fill="currentColor">
        <circle cx="0" cy="-35" r="0.8" />
        <circle cx="0" cy="-15" r="0.8" />
        <circle cx="0" cy="5" r="0.8" />
        <circle cx="0" cy="25" r="0.8" />
      </g>
      {/* Hoja superior central (la más alta) */}
      <g strokeOpacity="0.9">
        <path d="M0 -55 C -4 -56, -6 -54, -5 -52 C -3 -52, 0 -53, 0 -55 Z" fill="currentColor" />
        <path d="M0 -55 C 4 -56, 6 -54, 5 -52 C 3 -52, 0 -53, 0 -55 Z" fill="currentColor" />
        {/* Cogollo superior */}
        <circle cx="0" cy="-50" r="3" strokeOpacity="0.7" />
        <circle cx="-2" cy="-46" r="1.5" strokeOpacity="0.5" />
        <circle cx="2" cy="-46" r="1.5" strokeOpacity="0.5" />
      </g>
      {/* Hojas par 1 (alto) — 7 dedos cada hoja */}
      <g strokeOpacity="0.85">
        {/* Izq */}
        <path d="M0 -35 L -10 -42 M0 -35 L -16 -38 M0 -35 L -20 -32 M0 -35 L -22 -26 M0 -35 L -20 -20 M0 -35 L -15 -18 M0 -35 L -8 -20" />
        <path d="M-22 -26 L -20 -32 L -16 -38 L -10 -42 L -2 -36 L -8 -20 L -15 -18 L -20 -20 Z" strokeOpacity="0.5" />
        {/* Der */}
        <path d="M0 -35 L 10 -42 M0 -35 L 16 -38 M0 -35 L 20 -32 M0 -35 L 22 -26 M0 -35 L 20 -20 M0 -35 L 15 -18 M0 -35 L 8 -20" />
        <path d="M22 -26 L 20 -32 L 16 -38 L 10 -42 L 2 -36 L 8 -20 L 15 -18 L 20 -20 Z" strokeOpacity="0.5" />
      </g>
      {/* Hojas par 2 (medio) */}
      <g strokeOpacity="0.85">
        <path d="M0 -15 L -14 -20 M0 -15 L -22 -14 M0 -15 L -27 -7 M0 -15 L -28 0 M0 -15 L -22 4 M0 -15 L -12 4" />
        <path d="M-28 0 L -27 -7 L -22 -14 L -14 -20 L -4 -17 L -12 4 L -22 4 Z" strokeOpacity="0.45" />
        <path d="M0 -15 L 14 -20 M0 -15 L 22 -14 M0 -15 L 27 -7 M0 -15 L 28 0 M0 -15 L 22 4 M0 -15 L 12 4" />
        <path d="M28 0 L 27 -7 L 22 -14 L 14 -20 L 4 -17 L 12 4 L 22 4 Z" strokeOpacity="0.45" />
      </g>
      {/* Hojas par 3 (inferior, más pequeñas) */}
      <g strokeOpacity="0.7">
        <path d="M0 5 L -12 4 M0 5 L -18 8 M0 5 L -20 14 M0 5 L -15 18 M0 5 L -8 17" />
        <path d="M-20 14 L -18 8 L -12 4 L -4 7 L -8 17 L -15 18 Z" strokeOpacity="0.4" />
        <path d="M0 5 L 12 4 M0 5 L 18 8 M0 5 L 20 14 M0 5 L 15 18 M0 5 L 8 17" />
        <path d="M20 14 L 18 8 L 12 4 L 4 7 L 8 17 L 15 18 Z" strokeOpacity="0.4" />
      </g>
      {/* Base / maceta */}
      <g strokeOpacity="0.55">
        <path d="M-12 50 L -8 60 L 8 60 L 12 50 Z" />
        <line x1="-10" y1="54" x2="10" y2="54" strokeOpacity="0.4" />
      </g>
    </GothicArch>
  );
}

// Icono 2 — Guía Personalizada (rosa de los vientos elaborada con
// estrella central de 8 puntas, doble círculo, marcas de grado densas)
export function PillarGuia({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Círculos concéntricos */}
      <circle cx="0" cy="0" r="50" strokeOpacity="0.4" />
      <circle cx="0" cy="0" r="44" strokeOpacity="0.65" />
      <circle cx="0" cy="0" r="38" strokeOpacity="0.3" />
      <circle cx="0" cy="0" r="22" strokeOpacity="0.5" />
      <circle cx="0" cy="0" r="14" strokeOpacity="0.7" />
      {/* Marcas de grado largas (cada 30°) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={`long-${deg}`}
          x1="0"
          y1="-50"
          x2="0"
          y2="-44"
          transform={`rotate(${deg})`}
          strokeOpacity="0.6"
        />
      ))}
      {/* Marcas cortas (cada 10°) */}
      {Array.from({ length: 36 }).map((_, i) => {
        const deg = i * 10;
        if (deg % 30 === 0) return null;
        return (
          <line
            key={`short-${deg}`}
            x1="0"
            y1="-50"
            x2="0"
            y2="-46"
            transform={`rotate(${deg})`}
            strokeOpacity="0.3"
          />
        );
      })}
      {/* Puntas cardinales mayores (4) — rombos alargados rellenos parcialmente */}
      <g>
        <path d="M0 -44 L 5 0 L 0 44 L -5 0 Z" strokeOpacity="0.95" />
        <path d="M0 -38 L 3 0 L 0 38 L -3 0 Z" fill="currentColor" fillOpacity="0.35" strokeOpacity="0" />
        <path d="M-44 0 L 0 5 L 44 0 L 0 -5 Z" strokeOpacity="0.95" />
        <path d="M-38 0 L 0 3 L 38 0 L 0 -3 Z" fill="currentColor" fillOpacity="0.25" strokeOpacity="0" />
      </g>
      {/* Puntas intermedias (4) */}
      <g strokeOpacity="0.6">
        <path d="M-31 -31 L 0 -4 L 31 -31 L 4 0 Z" />
        <path d="M-31 31 L 0 4 L 31 31 L -4 0 Z" />
      </g>
      {/* Estrella central 8 puntas */}
      <g strokeOpacity="0.85">
        <path d="M0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill="currentColor" fillOpacity="0.6" />
      </g>
      {/* Núcleo */}
      <circle cx="0" cy="0" r="3" fill="currentColor" />
      <circle cx="0" cy="0" r="6" strokeOpacity="0.7" />
      {/* Letras N/S/E/O */}
      <g
        fontFamily="serif"
        fontSize="6"
        fill="currentColor"
        fillOpacity="0.9"
        textAnchor="middle"
        stroke="none"
      >
        <text x="0" y="-55" dy="0.35em">N</text>
        <text x="0" y="58" dy="0.35em">S</text>
        <text x="56" y="0" dy="0.35em">E</text>
        <text x="-56" y="0" dy="0.35em">O</text>
      </g>
    </GothicArch>
  );
}

// Icono 3 — El Santuario Privado (planta de la vida + flor central
// dentro del arco, simétrica, con motivos botánicos a los lados)
export function PillarSantuario({ className }: { className?: string }) {
  return (
    <GothicArch className={className}>
      {/* Tallo central */}
      <line x1="0" y1="55" x2="0" y2="-45" strokeOpacity="0.85" />
      {/* Flor central (mandala 8 pétalos) */}
      <g strokeOpacity="0.9">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-18"
            rx="3"
            ry="9"
            transform={`rotate(${deg} 0 -10)`}
          />
        ))}
        <circle cx="0" cy="-10" r="3.5" fill="currentColor" />
        <circle cx="0" cy="-10" r="6" strokeOpacity="0.5" />
      </g>
      {/* Aro de halo alrededor de la flor */}
      <circle cx="0" cy="-10" r="22" strokeOpacity="0.35" />
      {/* Pares de hojas simétricos (3 pares) */}
      <g strokeOpacity="0.8">
        {/* Par superior */}
        <path d="M-2 10 C -14 4, -22 8, -24 18 C -16 14, -8 14, 0 14 Z" />
        <path d="M2 10 C 14 4, 22 8, 24 18 C 16 14, 8 14, 0 14 Z" />
        {/* Par medio */}
        <path d="M-2 28 C -16 22, -26 28, -28 38 C -20 34, -10 32, 0 32 Z" strokeOpacity="0.7" />
        <path d="M2 28 C 16 22, 26 28, 28 38 C 20 34, 10 32, 0 32 Z" strokeOpacity="0.7" />
      </g>
      {/* Pequeñas bayas/semillas en el tallo */}
      <g fill="currentColor" fillOpacity="0.8">
        <circle cx="-6" cy="22" r="1.2" />
        <circle cx="6" cy="22" r="1.2" />
        <circle cx="-9" cy="40" r="1.2" />
        <circle cx="9" cy="40" r="1.2" />
      </g>
      {/* Base ornamental */}
      <g strokeOpacity="0.5">
        <path d="M-14 50 L 14 50" />
        <path d="M-10 54 L 10 54" strokeOpacity="0.3" />
        <path d="M-4 50 L 0 56 L 4 50" />
      </g>
    </GothicArch>
  );
}
