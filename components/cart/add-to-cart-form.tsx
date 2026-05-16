'use client';

import { useActionState, useEffect, useState } from 'react';
import { addToCartAction, type CartActionState } from '@/app/cart/actions';
import { Button } from '@/components/ui/button';

export function AddToCartForm({
  geneticId,
  cap,
  disabled,
}: {
  geneticId: string;
  cap: number;
  disabled?: boolean;
}) {
  const [state, action, isPending] = useActionState<CartActionState, FormData>(
    addToCartAction,
    undefined,
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (state?.ok) {
      const timer = setTimeout(() => setQty(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const max = Math.max(1, cap);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="geneticId" value={geneticId} />

      <div className="flex items-stretch gap-2">
        <div className="flex items-stretch border border-border bg-background">
          <button
            type="button"
            disabled={disabled || qty <= 1 || isPending}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex w-8 items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30"
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
            className="w-12 bg-transparent text-center text-sm font-mono outline-none"
            aria-label="Cantidad en gramos"
          />
          <button
            type="button"
            disabled={disabled || qty >= max || isPending}
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            className="flex w-8 items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>

        <Button
          type="submit"
          disabled={disabled || isPending}
          className="flex-1 rounded-none px-4 text-[11px] uppercase tracking-[0.2em]"
        >
          {isPending ? 'Sumando…' : 'Agregar'}
        </Button>
      </div>

      <div className="min-h-[1rem] text-[11px]">
        {state?.ok && state.message && <span className="text-brand">✓ {state.message}</span>}
        {state && !state.ok && <span className="text-destructive">{state.error}</span>}
      </div>
    </form>
  );
}
