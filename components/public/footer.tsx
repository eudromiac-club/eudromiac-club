export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl italic leading-none">eudromiac</p>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Asociación civil de socios pacientes. Acceso por invitación. Ley
            27.350 · REPROCANN.
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          © {year} · eudromiac club
        </p>
      </div>
    </footer>
  );
}
