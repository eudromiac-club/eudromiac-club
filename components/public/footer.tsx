export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-foreground">eudromiac club</span> ·
          asociación privada de socios.
        </p>
        <p>© {year} · acceso por invitación</p>
      </div>
    </footer>
  );
}
