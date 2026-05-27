'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { CARRIERS, CARRIER_KEYS } from '@/lib/orders/carriers';
import { dispatchOrderAction, type DispatchState } from '../actions';

export function DispatchForm({ orderId }: { orderId: string }) {
  const [state, action, isPending] = useActionState<DispatchState, FormData>(
    dispatchOrderAction,
    undefined,
  );

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="orderId" value={orderId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dispatch-carrier"
            className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Transportista
          </label>
          <select
            id="dispatch-carrier"
            name="carrier"
            defaultValue=""
            className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
          >
            <option value="" disabled>
              Elegí…
            </option>
            {CARRIER_KEYS.map((k) => (
              <option key={k} value={k}>
                {CARRIERS[k].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="dispatch-tracking"
            className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            N° de seguimiento
          </label>
          <input
            id="dispatch-tracking"
            name="trackingNumber"
            autoComplete="off"
            placeholder="Ej. 360000123456"
            className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand"
          />
        </div>
      </div>

      {state?.error && <p className="text-[12px] text-destructive">{state.error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="rounded-none bg-brand px-5 py-4 text-[11px] uppercase tracking-[0.25em] text-brand-foreground hover:bg-brand/90"
      >
        {isPending ? 'Despachando…' : 'Marcar en tránsito'}
      </Button>
    </form>
  );
}
