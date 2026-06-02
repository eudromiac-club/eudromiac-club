import Link from 'next/link';
import { LogoLockup } from '@/components/brand/logo';
import { LEGAL_ENTITY } from '@/lib/legal/entity';

type LegalShellProps = {
  eyebrow: string;
  title: string;
  /** Documento "hermano" para el link de pie (ej. de Términos a Privacidad). */
  sibling: { href: string; label: string };
  children: React.ReactNode;
};

// Capa de lectura para documentos legales. Tema oscuro, columna angosta y
// tipografía pensada para texto largo. El estilo de los hijos (h2/h3/p/ul/a…)
// se aplica con variantes arbitrarias sobre el contenedor `.legal-prose`,
// así el contenido de cada página queda como HTML semántico limpio.
export function LegalShell({ eyebrow, title, sibling, children }: LegalShellProps) {
  return (
    <main className="relative mx-auto max-w-3xl px-6 py-20 sm:py-24">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Volver al inicio
      </Link>

      <header className="mt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">◆ {eyebrow}</p>
        <h1 className="mt-4 text-balance font-display text-[clamp(1.8rem,5vw,3rem)] font-medium uppercase leading-[1.08] tracking-[0.03em]">
          {title}
        </h1>
        <div className="mt-6 h-px w-32 bg-gradient-to-r from-brand to-transparent" />
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
          {LEGAL_ENTITY.brand} · {LEGAL_ENTITY.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Última actualización: {LEGAL_ENTITY.ultimaActualizacion}
        </p>
      </header>

      <div
        className="legal-prose mt-14 max-w-none
          [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:pb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.06em] [&_h2]:text-foreground sm:[&_h2]:text-xl
          [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-sm [&_h3]:font-medium [&_h3]:uppercase [&_h3]:tracking-[0.08em] [&_h3]:text-foreground/90
          [&_p]:mt-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground
          [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5
          [&_li]:list-disc [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_li]:marker:text-brand/60
          [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand/80
          [&_strong]:font-medium [&_strong]:text-foreground"
      >
        {children}
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-border/40 pt-8">
        <Link
          href={sibling.href}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand transition-colors hover:text-brand/80"
        >
          → {sibling.label}
        </Link>
        <div className="mt-2">
          <LogoLockup size="sm" />
        </div>
      </div>
    </main>
  );
}
