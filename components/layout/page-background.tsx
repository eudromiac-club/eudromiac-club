import Image from 'next/image';
import { cn } from '@/lib/cn';

// Fondo de página responsive: imagen distinta para mobile y desktop, fija
// detrás del contenido (-z-10, sobre el bg del body). El overlay es un velo
// para mantener legible el texto del tema oscuro sobre la foto.
export function PageBackground({
  mobileSrc,
  webSrc,
  overlayClassName,
  overlayStyle,
  priority,
}: {
  mobileSrc: string;
  webSrc: string;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  priority?: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
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
      {(overlayClassName || overlayStyle) && (
        <div className={cn('absolute inset-0', overlayClassName)} style={overlayStyle} />
      )}
    </div>
  );
}
