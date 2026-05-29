'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { submitLeadAction, type LeadState } from './actions';

const labelCls = 'block font-mono text-[10px] uppercase tracking-widest text-muted-foreground';
const inputCls =
  'mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand';

export function LeadForm() {
  const [state, action, isPending] = useActionState<LeadState, FormData>(
    submitLeadAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="border border-brand/40 bg-card/40 p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">◆ Listo</p>
        <h3 className="mt-3 font-display text-2xl font-medium uppercase tracking-[0.08em]">
          Recibimos tus datos.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Nuestro equipo se va a contactar con vos para enviarte más información sobre las
          experiencias. Gracias por tu interés.
        </p>
      </div>
    );
  }

  const errors = state?.ok === false ? (state.errors ?? {}) : {};
  const message = state?.ok === false ? state.message : undefined;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="source" value="experiencias" />

      <div>
        <label htmlFor="lead-name" className={labelCls}>
          Nombre (opcional)
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          className={`${inputCls} ${errors.name ? 'border-destructive' : ''}`}
        />
        {errors.name && <p className="mt-1 text-[11px] text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="lead-phone" className={labelCls}>
          Teléfono <span className="text-brand">*</span>
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={errors.phone ? true : undefined}
          className={`${inputCls} ${errors.phone ? 'border-destructive' : ''}`}
        />
        {errors.phone && <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="lead-email" className={labelCls}>
          Email <span className="text-brand">*</span>
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          className={`${inputCls} ${errors.email ? 'border-destructive' : ''}`}
        />
        {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
      </div>

      {message && (
        <p className="border border-destructive/40 bg-destructive/10 p-3 text-[12px] text-destructive">
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none bg-brand px-8 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
      >
        {isPending ? 'Enviando…' : 'Quiero más información'}
      </Button>
    </form>
  );
}
