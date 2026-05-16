import { cn } from '@/lib/cn';

// Esquinas decorativas SVG cobre que se posicionan absolutamente en
// las 4 esquinas del contenedor. Pasale `children` con la imagen/contenido.
function Corner({ className, transform }: { className?: string; transform?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={cn('absolute h-7 w-7 text-brand', className)}
      style={{ transform }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M28 0 L0 0 L0 28" strokeOpacity="0.95" />
      <path d="M22 4 L4 4 L4 22" strokeOpacity="0.5" />
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function OrnateFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative border border-brand/30 bg-card/30 p-4',
        'transition-colors duration-300 hover:border-brand/60',
        className,
      )}
    >
      <Corner className="left-[-1px] top-[-1px]" />
      <Corner className="right-[-1px] top-[-1px]" transform="scaleX(-1)" />
      <Corner className="bottom-[-1px] left-[-1px]" transform="scaleY(-1)" />
      <Corner className="bottom-[-1px] right-[-1px]" transform="scale(-1, -1)" />
      {children}
    </div>
  );
}
