'use client';

import { useState, useTransition } from 'react';
import { updateCartItemAction, removeFromCartAction } from '@/app/cart/actions';
import { Button } from '@/components/ui/button';

export function CartItemRow({
  geneticId,
  quantity,
  cap,
}: {
  geneticId: string;
  quantity: number;
  cap: number;
}) {
  const [qty, setQty] = useState(quantity);
  const [pending, startTransition] = useTransition();

  const commit = (next: number) => {
    const target = Math.max(1, Math.min(cap, next));
    setQty(target);
    if (target === quantity) return;
    const fd = new FormData();
    fd.set('geneticId', geneticId);
    fd.set('quantity', String(target));
    startTransition(() => {
      updateCartItemAction(fd);
    });
  };

  const remove = () => {
    const fd = new FormData();
    fd.set('geneticId', geneticId);
    startTransition(() => {
      removeFromCartAction(fd);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-stretch border border-border bg-background">
        <button
          type="button"
          onClick={() => commit(qty - 1)}
          disabled={pending || qty <= 1}
          className="flex w-7 items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30"
          aria-label="Disminuir"
        >
          −
        </button>
        <span className="w-8 select-none bg-transparent py-1 text-center text-sm font-mono">{qty}</span>
        <button
          type="button"
          onClick={() => commit(qty + 1)}
          disabled={pending || qty >= cap}
          className="flex w-7 items-center justify-center text-brand transition-colors hover:bg-brand/10 disabled:opacity-30"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
      <Button
        type="button"
        onClick={remove}
        variant="ghost"
        size="sm"
        disabled={pending}
        className="text-[10px] uppercase tracking-[0.2em] text-destructive hover:text-destructive"
      >
        Quitar
      </Button>
    </div>
  );
}
