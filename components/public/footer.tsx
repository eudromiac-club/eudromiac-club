import Link from 'next/link';
import { LogoLockup } from '@/components/brand/logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16">
        <LogoLockup size="md" />
        <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          Curaduría botánica y guía privada para el viaje hacia el equilibrio.
          Acceso restringido para socios pacientes.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
          <Link href="/terminos" className="transition-colors hover:text-foreground">
            Términos y Condiciones
          </Link>
          <span aria-hidden className="text-muted-foreground/30">·</span>
          <Link href="/privacidad" className="transition-colors hover:text-foreground">
            Política de Privacidad
          </Link>
        </nav>
        <div className="mt-2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          <p>© {year} · EUDROMIA CLUB</p>
          <p className="max-w-md text-center leading-relaxed">
            Fundación Argentina California 2030 · Marco legal: Ley 27.350
          </p>
        </div>
      </div>
    </footer>
  );
}
