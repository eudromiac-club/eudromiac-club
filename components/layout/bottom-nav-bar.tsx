'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

type IconKey = 'home' | 'shop' | 'cart' | 'orders' | 'admin';

type NavItem = {
  href: string;
  label: string;
  icon: IconKey;
  // El item está activo si el pathname arranca con `match` (o es exacto si exact).
  match: string;
  exact?: boolean;
  badge?: number;
};

function Icon({ k }: { k: IconKey }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-[22px] w-[22px]',
    'aria-hidden': true,
  };
  switch (k) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case 'shop':
      // Hoja de cannabis simplificada.
      return (
        <svg {...common}>
          <path d="M12 21v-5" />
          <path d="M12 16c-3-1-5-4-5-8 3 0 5 2 5 5" />
          <path d="M12 16c3-1 5-4 5-8-3 0-5 2-5 5" />
          <path d="M12 13c-2.2-1.4-3-4-3-7 2.2.6 3 3 3 5" />
          <path d="M12 13c2.2-1.4 3-4 3-7-2.2.6-3 3-3 5" />
        </svg>
      );
    case 'cart':
      return (
        <svg {...common}>
          <path d="M3 5h2l2.5 11h11l2-8H6.5" />
          <circle cx="9" cy="20" r="1.3" />
          <circle cx="17" cy="20" r="1.3" />
        </svg>
      );
    case 'orders':
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h7M9 17h7" />
        </svg>
      );
    case 'admin':
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
        </svg>
      );
  }
}

export function BottomNavBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.match : pathname.startsWith(item.match);

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 py-2.5 transition-colors',
                  active ? 'text-brand' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <span
                    className="absolute inset-x-5 top-0 h-px bg-brand"
                    style={{ boxShadow: '0 0 10px hsl(var(--brand) / 0.7)' }}
                    aria-hidden
                  />
                )}
                <span className="relative">
                  <Icon k={item.icon} />
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className="absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] text-brand-foreground"
                      style={{ boxShadow: '0 0 8px hsl(var(--brand) / 0.6)' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.12em]">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
