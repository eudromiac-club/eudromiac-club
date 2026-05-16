import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/dal';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export async function Topbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="eudromiac club — inicio" className="group flex items-center gap-2">
          <span className="font-display text-lg italic leading-none">eudromiac</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">club</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Navegación principal">
          {!user ? (
            <>
              <a href="/#club" className="text-muted-foreground transition-colors hover:text-foreground">
                El club
              </a>
              <a href="/#filosofia" className="text-muted-foreground transition-colors hover:text-foreground">
                Filosofía
              </a>
              <a href="/#acceso" className="text-muted-foreground transition-colors hover:text-foreground">
                Acceso
              </a>
            </>
          ) : (
            <>
              <Link href="/catalogo" className="text-muted-foreground transition-colors hover:text-foreground">
                Catálogo
              </Link>
              <Link href="/cuenta" className="text-muted-foreground transition-colors hover:text-foreground">
                Mi cuenta
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <Button asChild size="sm" variant="outline" className="rounded-full px-4">
              <Link href="/login">Socios</Link>
            </Button>
          ) : (
            <>
              {user.status === 'pending_kyc' && (
                <span className="hidden text-xs text-amber-700 dark:text-amber-400 sm:inline">
                  · KYC pendiente
                </span>
              )}
              <form action={logoutAction}>
                <Button type="submit" size="sm" variant="ghost" className="rounded-full">
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
