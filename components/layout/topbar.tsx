import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/dal';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { getCartCount } from '@/lib/cart/server';

export async function Topbar() {
  const user = await getCurrentUser();
  const cartCount = user && user.status === 'active' ? await getCartCount(user.id) : 0;

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
              <Link href="/login">Miembros</Link>
            </Button>
          ) : (
            <>
              {user.status === 'pending_kyc' && (
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-brand sm:inline">
                  KYC pendiente
                </span>
              )}
              {user.status === 'under_review' && (
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-brand sm:inline">
                  En revisión
                </span>
              )}
              {user.status === 'rejected' && (
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-destructive sm:inline">
                  Rechazada
                </span>
              )}
              {user.status === 'active' && (
                <Link
                  href="/carrito"
                  aria-label={`Carrito${cartCount > 0 ? ` (${cartCount}g)` : ''}`}
                  className="relative inline-flex items-center gap-2 border border-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M3 5h2l2.5 11h11l2-8H6.5" />
                    <circle cx="9" cy="20" r="1.3" />
                    <circle cx="17" cy="20" r="1.3" />
                  </svg>
                  <span className="hidden sm:inline">Carrito</span>
                  {cartCount > 0 && (
                    <span
                      className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 font-mono text-[10px] text-brand-foreground"
                      style={{ boxShadow: '0 0 12px hsl(var(--brand) / 0.6)' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
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
