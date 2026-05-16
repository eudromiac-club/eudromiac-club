import { Emblem } from './emblem';
import { cn } from '@/lib/cn';

export function LogoLockup({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: { emblem: 'h-6 w-6', name: 'text-xs', club: 'text-[10px]' },
    md: { emblem: 'h-10 w-10', name: 'text-xl', club: 'text-xs' },
    lg: { emblem: 'h-16 w-16 sm:h-20 sm:w-20', name: 'text-3xl sm:text-4xl', club: 'text-sm sm:text-base' },
    xl: { emblem: 'h-24 w-24 sm:h-28 sm:w-28', name: 'text-5xl sm:text-6xl', club: 'text-base sm:text-lg' },
  } as const;

  const s = sizes[size];

  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <Emblem className={cn(s.emblem, 'mb-3 text-brand drop-shadow-[0_0_20px_hsl(var(--brand)/0.4)]')} />
      <span
        className={cn(
          'font-display font-medium tracking-[0.18em] text-foreground',
          s.name,
        )}
      >
        EUDROMIA
      </span>
      <span
        className={cn(
          'mt-1 font-display tracking-[0.45em] text-brand',
          s.club,
        )}
      >
        CLUB
      </span>
    </div>
  );
}
