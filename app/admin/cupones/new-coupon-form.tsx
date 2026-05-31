'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCouponAction, type NewCouponState } from './actions';

const labelCls = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';

export function NewCouponForm() {
  const [state, action, isPending] = useActionState<NewCouponState, FormData>(
    createCouponAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state && !state.ok ? state.errors : undefined;
  const created = state && state.ok ? state.code : null;

  // Al crear con éxito, limpiamos el form para cargar otro.
  useEffect(() => {
    if (created) formRef.current?.reset();
  }, [created]);

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-5 border border-border bg-card p-6"
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
        ◆ Nuevo cupón
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className={labelCls}>
            Código
          </label>
          <Input
            id="code"
            name="code"
            required
            maxLength={30}
            placeholder="Ej: BIENVENIDA10"
            className="uppercase"
            autoComplete="off"
          />
          {errors?.code && <p className="mt-1 text-xs text-destructive">{errors.code}</p>}
        </div>
        <div>
          <label htmlFor="discountPct" className={labelCls}>
            Descuento (%)
          </label>
          <Input
            id="discountPct"
            name="discountPct"
            type="number"
            min={1}
            max={100}
            required
            placeholder="10"
          />
          {errors?.discountPct && (
            <p className="mt-1 text-xs text-destructive">{errors.discountPct}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="expiresAt" className={labelCls}>
            Vencimiento (opcional)
          </label>
          <Input id="expiresAt" name="expiresAt" type="date" />
          {errors?.expiresAt && (
            <p className="mt-1 text-xs text-destructive">{errors.expiresAt}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className={labelCls}>
            Nota interna (opcional)
          </label>
          <Input
            id="description"
            name="description"
            maxLength={120}
            placeholder="Para qué es este cupón"
          />
        </div>
      </div>

      {errors?.form && <p className="text-sm text-destructive">{errors.form}</p>}
      {created && (
        <p className="text-sm text-brand">Cupón {created} creado.</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
      >
        {isPending ? 'Creando…' : 'Crear cupón'}
      </Button>
    </form>
  );
}
