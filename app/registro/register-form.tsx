'use client';

import { useActionState, useId, useState } from 'react';
import { registerAction, type RegisterState } from '@/app/actions/register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function labelClass() {
  return 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';
}

export function RegisterForm() {
  const [state, action, isPending] = useActionState<RegisterState, FormData>(
    registerAction,
    undefined,
  );
  const errors = state && !state.ok ? state.errors : undefined;
  const [noReprocann, setNoReprocann] = useState(false);
  const noReprocannId = useId();

  return (
    <form action={action} className="space-y-8">
      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Cuenta
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelClass()}>
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={120}
            />
            {errors?.email && <p className="mt-1 text-xs text-destructive">{errors.email[0]}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="password" className={labelClass()}>
              Contraseña
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
            {errors?.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password[0]}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Datos personales
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass()}>
              Nombre
            </label>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              maxLength={80}
            />
            {errors?.firstName && (
              <p className="mt-1 text-xs text-destructive">{errors.firstName[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass()}>
              Apellido
            </label>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
              maxLength={80}
            />
            {errors?.lastName && (
              <p className="mt-1 text-xs text-destructive">{errors.lastName[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="dni" className={labelClass()}>
              DNI
            </label>
            <Input
              id="dni"
              name="dni"
              inputMode="numeric"
              required
              maxLength={10}
              placeholder="solo números"
            />
            {errors?.dni && <p className="mt-1 text-xs text-destructive">{errors.dni[0]}</p>}
          </div>
          <div>
            <label htmlFor="birthDate" className={labelClass()}>
              Fecha de nacimiento
            </label>
            <Input id="birthDate" name="birthDate" type="date" required />
            {errors?.birthDate && (
              <p className="mt-1 text-xs text-destructive">{errors.birthDate[0]}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className={labelClass()}>
              Teléfono
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={40}
              placeholder="+54 9 11 ..."
            />
            {errors?.phone && <p className="mt-1 text-xs text-destructive">{errors.phone[0]}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ REPROCANN
        </h2>
        <div>
          <label htmlFor="reprocannNumber" className={labelClass()}>
            Número de trámite
          </label>
          <Input
            id="reprocannNumber"
            name="reprocannNumber"
            required={!noReprocann}
            disabled={noReprocann}
            maxLength={60}
            aria-disabled={noReprocann}
            className={noReprocann ? 'opacity-50' : undefined}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {noReprocann
              ? 'No es requerido: un médico del equipo se va a contactar con vos.'
              : 'El comprobante (PDF/imagen) lo vas a subir desde tu cuenta una vez creada.'}
          </p>
          {errors?.reprocannNumber && (
            <p className="mt-1 text-xs text-destructive">{errors.reprocannNumber[0]}</p>
          )}

          <label
            htmlFor={noReprocannId}
            className="mt-5 flex cursor-pointer items-start gap-3 rounded-sm border border-border/60 bg-card/40 p-4 transition hover:border-brand/60"
          >
            <input
              id={noReprocannId}
              name="noReprocann"
              type="checkbox"
              checked={noReprocann}
              onChange={(e) => setNoReprocann(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm leading-snug text-foreground">
                No tengo REPROCANN / Quiero tramitarlo — los contactamos con nuestro médico
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                Si no tenés tu REPROCANN, registrate igual. Un médico del equipo se va a poner en
                contacto con vos para orientarte en el trámite.
              </span>
            </span>
          </label>
        </div>
      </section>

      {errors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {errors.form[0]}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
        >
          {isPending ? 'Procesando…' : 'Asociarme'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Después de registrarte vas a poder subir el comprobante y esperar la validación del
          equipo.
        </p>
      </div>
    </form>
  );
}
