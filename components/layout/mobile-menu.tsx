'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/actions/auth';

type Props = {
  loggedIn: boolean;
  role?: string | null;
  status?: string | null;
};

const linkCls =
  'border-b border-border/40 py-3 text-muted-foreground transition-colors hover:text-foreground';

export function MobileMenu({ loggedIn, role, status }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Bloquear el scroll del body mientras el menú está abierto.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-brand"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[82%] flex-col border-l border-border bg-background p-6 shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-medium tracking-[0.3em] text-foreground">
            MENÚ
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar menú"
            className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav
          className="mt-6 flex flex-col text-[12px] uppercase tracking-[0.2em]"
          aria-label="Navegación"
        >
          {!loggedIn ? (
            <>
              <Link href="/#pilares" onClick={close} className={linkCls}>
                Pilares
              </Link>
              <Link href="/#coleccion" onClick={close} className={linkCls}>
                Colección
              </Link>
              <Link href="/#acceso" onClick={close} className={linkCls}>
                Acceso
              </Link>
            </>
          ) : (
            <>
              <Link href="/dispensario" onClick={close} className={linkCls}>
                Dispensario
              </Link>
              {status === 'active' && (
                <Link href="/carrito" onClick={close} className={linkCls}>
                  Carrito
                </Link>
              )}
              <Link href="/cuenta" onClick={close} className={linkCls}>
                Mi cuenta
              </Link>
              {role === 'admin' && (
                <Link href="/admin" onClick={close} className={linkCls}>
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-8">
          {!loggedIn ? (
            <>
              <Button
                asChild
                className="rounded-none px-5 py-5 text-[11px] uppercase tracking-[0.2em]"
              >
                <Link href="/registro" onClick={close}>
                  Asociarse
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-brand/60 px-5 py-5 text-[11px] uppercase tracking-[0.2em] text-brand hover:bg-brand/10 hover:text-brand"
              >
                <Link href="/login" onClick={close}>
                  Miembros
                </Link>
              </Button>
            </>
          ) : (
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-none px-5 py-5 text-[11px] uppercase tracking-[0.2em]"
              >
                Salir
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
