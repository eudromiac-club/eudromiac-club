import Link from 'next/link';
import { cn } from '@/lib/cn';

export type CategoryKey = 'flores' | 'extractos' | 'aceites' | 'accesorios';

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  available: boolean;
  icon: React.ReactNode;
}[] = [
  {
    key: 'flores',
    label: 'Flores',
    available: true,
    icon: (
      <path d="M12 21v-6M12 15c-3.5-1-6-4.5-6-9 3.5 0 6 2.5 6 6M12 15c3.5-1 6-4.5 6-9-3.5 0-6 2.5-6 6M12 12c-2.5-1.5-3.5-4.5-3.5-8C11 4.5 12 7.5 12 10M12 12c2.5-1.5 3.5-4.5 3.5-8C13 4.5 12 7.5 12 10" />
    ),
  },
  {
    key: 'extractos',
    label: 'Extractos',
    available: false,
    icon: <path d="M12 3c3 4 5 6.5 5 9.5A5 5 0 0 1 7 12.5C7 9.5 9 7 12 3z" />,
  },
  {
    key: 'aceites',
    label: 'Aceites',
    available: false,
    icon: (
      <>
        <path d="M9 3h6M10 3v3M14 3v3" />
        <path d="M8 9a4 4 0 0 1 4-3 4 4 0 0 1 4 3l1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      </>
    ),
  },
  {
    key: 'accesorios',
    label: 'Accesorios',
    available: false,
    icon: (
      <>
        <path d="M5 10h14l-1.5 5.5A3 3 0 0 1 14.6 18H9.4a3 3 0 0 1-2.9-2.5z" />
        <path d="M12 10V6a2 2 0 0 1 2-2" />
      </>
    ),
  },
];

export function CategoryNav({ active }: { active: CategoryKey }) {
  return (
    <nav aria-label="Categorías" className="mt-12">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Explorar
      </p>
      <ul className="mx-auto mt-5 grid max-w-2xl grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((c) => {
          const isActive = c.key === active;
          return (
            <li key={c.key}>
              <Link
                href={`/dispensario?cat=${c.key}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-lg border px-2 py-4 transition-colors',
                  isActive
                    ? 'border-brand/60 bg-brand/10 text-brand'
                    : 'border-border/60 bg-card/40 text-muted-foreground hover:border-brand/40 hover:text-foreground',
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7"
                  aria-hidden
                >
                  {c.icon}
                </svg>
                <span className="text-center text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]">
                  {c.label}
                </span>
                {!c.available && (
                  <span className="absolute -top-2 right-1 rounded-full bg-brand px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider text-brand-foreground sm:text-[8px]">
                    Pronto
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function isCategoryKey(v: string | undefined): v is CategoryKey {
  return v === 'flores' || v === 'extractos' || v === 'aceites' || v === 'accesorios';
}
