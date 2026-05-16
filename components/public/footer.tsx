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
        <div className="mt-2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
          <p>© {year} · EUDROMIA CLUB</p>
          <p className="max-w-md text-center leading-relaxed">
            Asociación civil sin fines de lucro · Marco legal: Ley 27.350
          </p>
        </div>
      </div>
    </footer>
  );
}
