import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/dal';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export async function Topbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="EUDROMIA CLUB — inicio"
          className="font-display text-base font-medium tracking-[0.3em] text-foreground"
        >
          EUDROMIA <span className="text-brand">CLUB</span>
        </Link>

        <nav
          className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.2em] md:flex"
          aria-label="Navegación principal"
        >
          {!user ? (
            <>
              <a href="/#pilares" className="text-muted-foreground transition-colors hover:text-foreground">
                Pilares
              </a>
              <a href="/#coleccion" className="text-muted-foreground transition-colors hover:text-foreground">
                Colección
              </a>
              <a href="/#acceso" className="text-muted-foreground transition-colors hover:text-foreground">
                Acceso
              </a>
            </>
          ) : (
            <>
              <Link href="/dispensario" className="text-muted-foreground transition-colors hover:text-foreground">
                Dispensario
              </Link>
              <Link href="/cuenta" className="text-muted-foreground transition-colors hover:text-foreground">
                Mi cuenta
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-none border-brand/60 px-5 text-[11px] uppercase tracking-[0.2em] text-brand hover:bg-brand/10 hover:text-brand"
            >
              <Link href="/login">Solicitar acceso</Link>
            </Button>
          ) : (
            <>
              {user.status === 'pending_kyc' && (
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-brand sm:inline">
                  KYC pendiente
                </span>
              )}
              <form action={logoutAction}>
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="text-[11px] uppercase tracking-[0.2em]"
                >
                  Salir
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
