'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { startCheckoutAction, type CheckoutState } from '@/app/carrito/checkout-action';
import { AR_PROVINCES, DELIVERY_WINDOW_LABEL } from '@/lib/orders/shipping';

export type ShippingDefaults = {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryWindow: string;
  notes: string;
};

const labelCls = 'block font-mono text-[10px] uppercase tracking-widest text-muted-foreground';
const inputCls =
  'mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand';

function Field({
  name,
  label,
  defaultValue,
  error,
  required,
  autoComplete,
  type = 'text',
}: {
  name: string;
  label: string;
  defaultValue: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={`ship-${name}`} className={labelCls}>
        {label}
        {required && <span className="text-brand"> *</span>}
      </label>
      <input
        id={`ship-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`${inputCls} ${error ? 'border-destructive' : ''}`}
      />
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

export function ShippingForm({
  defaults,
  isFree,
}: {
  defaults: ShippingDefaults;
  isFree: boolean;
}) {
  const [state, action, isPending] = useActionState<CheckoutState, FormData>(
    startCheckoutAction,
    undefined,
  );
  const errors = state?.errors ?? {};
  const [payMethod, setPayMethod] = useState<'mercadopago' | 'cash_on_delivery'>('mercadopago');

  const submitLabel = isFree
    ? 'Confirmar pedido'
    : payMethod === 'cash_on_delivery'
      ? 'Confirmar pedido'
      : 'Continuar al pago';

  return (
    <form action={action} className="space-y-5">
      <Field
        name="recipientName"
        label="Nombre de quien recibe"
        defaultValue={defaults.recipientName}
        error={errors.recipientName}
        required
        autoComplete="name"
      />
      <Field
        name="phone"
        label="Teléfono de contacto"
        defaultValue={defaults.phone}
        error={errors.phone}
        required
        autoComplete="tel"
        type="tel"
      />
      <Field
        name="street"
        label="Calle y número"
        defaultValue={defaults.street}
        error={errors.street}
        required
        autoComplete="street-address"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="city"
          label="Localidad"
          defaultValue={defaults.city}
          error={errors.city}
          required
          autoComplete="address-level2"
        />
        <div>
          <label htmlFor="ship-province" className={labelCls}>
            Provincia<span className="text-brand"> *</span>
          </label>
          <select
            id="ship-province"
            name="province"
            defaultValue={defaults.province}
            aria-invalid={errors.province ? true : undefined}
            className={`${inputCls} ${errors.province ? 'border-destructive' : ''}`}
          >
            <option value="">Elegí una provincia…</option>
            {AR_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-[11px] text-destructive">{errors.province}</p>
          )}
        </div>
      </div>
      <Field
        name="postalCode"
        label="Código postal (opcional)"
        defaultValue={defaults.postalCode}
        autoComplete="postal-code"
      />
      <div>
        <label htmlFor="ship-deliveryWindow" className={labelCls}>
          Horario de entrega preferido<span className="text-brand"> *</span>
        </label>
        <select
          id="ship-deliveryWindow"
          name="deliveryWindow"
          defaultValue={defaults.deliveryWindow}
          aria-invalid={errors.deliveryWindow ? true : undefined}
          className={`${inputCls} ${errors.deliveryWindow ? 'border-destructive' : ''}`}
        >
          <option value="">Elegí un rango horario…</option>
          {Object.entries(DELIVERY_WINDOW_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.deliveryWindow && (
          <p className="mt-1 text-[11px] text-destructive">{errors.deliveryWindow}</p>
        )}
      </div>
      <div>
        <label htmlFor="ship-notes" className={labelCls}>
          Notas para la entrega (opcional)
        </label>
        <textarea
          id="ship-notes"
          name="notes"
          rows={3}
          defaultValue={defaults.notes}
          placeholder="Entre calles, timbre, horario preferido…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {!isFree && (
        <fieldset className="space-y-3">
          <legend className={labelCls}>Forma de pago<span className="text-brand"> *</span></legend>
          <label
            className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
              payMethod === 'mercadopago'
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-brand/50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="mercadopago"
              checked={payMethod === 'mercadopago'}
              onChange={() => setPayMethod('mercadopago')}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm text-foreground">MercadoPago</span>
              <span className="text-xs text-muted-foreground">
                Tarjeta de crédito/débito, transferencia o efectivo en Rapipago/Pago Fácil.
                Pagás ahora de forma segura.
              </span>
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
              payMethod === 'cash_on_delivery'
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-brand/50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={payMethod === 'cash_on_delivery'}
              onChange={() => setPayMethod('cash_on_delivery')}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm text-foreground">Efectivo contra entrega</span>
              <span className="text-xs text-muted-foreground">
                Pagás en efectivo al recibir el pedido. El equipo coordina la entrega con vos.
              </span>
            </span>
          </label>
        </fieldset>
      )}

      {state?.message && (
        <p className="border border-destructive/40 bg-destructive/10 p-3 text-[12px] text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none bg-brand px-8 py-6 text-[11px] uppercase tracking-[0.3em] text-brand-foreground hover:bg-brand/90"
      >
        {isPending ? 'Procesando…' : submitLabel}
      </Button>
    </form>
  );
}
