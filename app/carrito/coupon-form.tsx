'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { applyCouponAction, removeCouponAction, type CouponState } from './coupon-action';

export function CouponForm({ currentCode }: { currentCode: string | null }) {
  const [state, action, isPending] = useActionState<CouponState, FormData>(
    applyCouponAction,
    undefined,
  );

  if (currentCode) {
    return (
      <form
        action={removeCouponAction}
        className="flex items-center justify-between gap-3 border border-brand/40 bg-brand/5 px-4 py-3"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-brand">
            ◆ Cupón aplicado
          </p>
          <p className="mt-0.5 font-mono text-sm tracking-widest">{currentCode}</p>
        </div>
        <button
          type="submit"
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-destructive"
        >
          Quitar
        </button>
      </form>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <label
        htmlFor="coupon-code"
        className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        ¿Tenés un cupón?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon-code"
          name="code"
          placeholder="CÓDIGO"
          autoComplete="off"
          className="flex-1 border border-border bg-background px-3 py-2 text-sm uppercase tracking-widest outline-none transition-colors focus:border-brand"
        />
        <Button
          type="submit"
          disabled={isPending}
          variant="outline"
          className="rounded-none border-brand/60 bg-transparent px-5 text-[11px] uppercase tracking-[0.2em] text-brand hover:bg-brand/10"
        >
          {isPending ? '…' : 'Aplicar'}
        </Button>
      </div>
      {state && !state.ok && (
        <p className="text-[11px] text-destructive">{state.error}</p>
      )}
    </form>
  );
}
