'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { addToCartAction, type CartActionState } from '@/app/cart/actions';
import { Button } from '@/components/ui/button';

export function AddToCartForm({
  geneticId,
  cap,
  disabled,
  showGoToCart = true,
  showcase = false,
}: {
  geneticId: string;
  cap: number;
  disabled?: boolean;
  // En el carrito mismo no tiene sentido ofrecer "Ir al carrito" (ya estás ahí
  // y la lista se refresca sola), así que se puede ocultar.
  showGoToCart?: boolean;
  // Modo "vidriera" para la interna: selector grande arriba + botón píldora
  // dorada full-width "Agregar al carrito" (estilo mockup mobile).
  showcase?: boolean;
}) {
  const [state, action, isPending] = useActionState<CartActionState, FormData>(
    addToCartAction,
    undefined,
  );
  const [qty, setQty] = useState(1);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      const timer = setTimeout(() => setQty(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const max = Math.max(1, cap);
  const showConfirm = state?.ok && !dismissed;

  return (
    // Al reenviar, volvemos a mostrar el panel de confirmación.
    <form action={action} onSubmit={() => setDismissed(false)} className="space-y-2">
      <input type="hidden" name="geneticId" value={geneticId} />

      <div className={showcase ? 'space-y-4' : 'flex items-stretch gap-2'}>
        <div
          className={
            showcase
              ? 'flex items-stretch self-center border border-brand/30 bg-background'
              : 'flex items-stretch border border-border bg-background'
          }
        >
          <button
            type="button"
            disabled={disabled || qty <= 1 || isPending}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className={`flex items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30 ${showcase ? 'w-11 text-lg' : 'w-8'}`}
            aria-label="Disminuir"
          >
            −
          </button>
          <input
            type="number"
            name="quantity"
            min={1}
            max={max}
            step={1}
            value={qty}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setQty(Math.max(1, Math.min(max, Math.floor(n))));
            }}
            className={`bg-transparent text-center font-mono outline-none ${showcase ? 'w-16 text-base' : 'w-12 text-sm'}`}
            aria-label="Cantidad en gramos"
          />
          <button
            type="button"
            disabled={disabled || qty >= max || isPending}
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            className={`flex items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30 ${showcase ? 'w-11 text-lg' : 'w-8'}`}
            aria-label="Aumentar"
          >
            +
          </button>
        </div>

        <Button
          type="submit"
          disabled={disabled || isPending}
          className={
            showcase
              ? 'w-full rounded-full py-6 text-xs uppercase tracking-[0.3em] shadow-[0_8px_30px_hsl(var(--brand)/0.35)]'
              : 'flex-1 rounded-none px-4 text-[11px] uppercase tracking-[0.2em]'
          }
        >
          {isPending ? 'Sumando…' : showcase ? 'Agregar al carrito' : 'Agregar'}
        </Button>
      </div>

      {showConfirm ? (
        <div className="border border-brand/40 bg-brand/5 p-3">
          <p className="text-[11px] text-brand">✓ {state.message}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {showGoToCart && (
              <Button
                asChild
                size="sm"
                className="h-auto rounded-none bg-brand px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-brand-foreground hover:bg-brand/90"
              >
                <Link href="/carrito">Ir al carrito →</Link>
              </Button>
            )}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[1rem] text-[11px]">
          {state && !state.ok && <span className="text-destructive">{state.error}</span>}
        </div>
      )}
    </form>
  );
}
