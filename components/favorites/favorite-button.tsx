'use client';

import { useState, useTransition, type MouseEvent } from 'react';
import { toggleFavoriteAction } from '@/app/favorites/actions';
import { cn } from '@/lib/cn';

export function FavoriteButton({
  geneticId,
  initial,
  size = 'md',
  className,
}: {
  geneticId: string;
  initial: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();

  const dim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const icon = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  const toggle = (e: MouseEvent) => {
    // El corazón suele vivir adentro de un <Link> (card de la grilla): que el
    // click no dispare la navegación.
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    const next = !fav;
    setFav(next); // optimista
    start(async () => {
      const res = await toggleFavoriteAction(geneticId);
      setFav(res.ok ? res.favorited : !next); // confirma o revierte
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={fav}
      aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={cn(
        'inline-flex items-center justify-center rounded-full border backdrop-blur transition-colors',
        dim,
        fav
          ? 'border-brand/60 bg-brand/15 text-brand'
          : 'border-border/60 bg-background/60 text-muted-foreground hover:border-brand/40 hover:text-brand',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={fav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(icon, 'transition-transform duration-200', fav && 'scale-110')}
        aria-hidden
      >
        <path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c1.9 0 3.2 1.1 4 2.2.8-1.1 2.1-2.2 4-2.2 3 0 4.5 3 3 6-2.5 4.15-9.5 8.5-9.5 8.5z" />
      </svg>
    </button>
  );
}
