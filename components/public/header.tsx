import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight"
          aria-label="eudromiac club — inicio"
        >
          eudromiac<span className="text-muted-foreground"> club</span>
        </Link>
        <Link
          href="/invitacion"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
        >
          Tengo invitación
        </Link>
      </div>
    </header>
  );
}
