import { cn } from '@/lib/cn';

type EmblemProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

// Emblema decorativo simétrico: flor abstracta de 6 pétalos + halo + tallo
// inscritos en círculo. Stroke fino dorado, sin relleno. Diseñado para
// quedar bien a 40px y a 200px. Anim-friendly: cada path está separado.
export function Emblem({ className, ...props }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('text-brand', className)}
      {...props}
    >
      {/* Halo exterior */}
      <circle cx="32" cy="32" r="29" strokeOpacity="0.35" />
      <circle cx="32" cy="32" r="24" strokeOpacity="0.55" />

      {/* Pétalos 6-fold (rotaciones de un pétalo base) */}
      <g className="emblem-petals">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M32 32 C 30 22, 30 14, 32 8 C 34 14, 34 22, 32 32 Z"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </g>

      {/* Pistilo / centro */}
      <circle cx="32" cy="32" r="2.2" fill="currentColor" />
      <circle cx="32" cy="32" r="5" strokeOpacity="0.7" />

      {/* Marcas cardinales sutiles */}
      <line x1="32" y1="3" x2="32" y2="6" strokeOpacity="0.6" />
      <line x1="32" y1="58" x2="32" y2="61" strokeOpacity="0.6" />
      <line x1="3" y1="32" x2="6" y2="32" strokeOpacity="0.6" />
      <line x1="58" y1="32" x2="61" y2="32" strokeOpacity="0.6" />
    </svg>
  );
}
