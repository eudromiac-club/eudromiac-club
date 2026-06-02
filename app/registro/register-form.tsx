'use client';

import { useActionState, useEffect, useId, useState } from 'react';
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
  // Valores devueltos por el server cuando falla la validación: repueblan el
  // form para que el socio no pierda lo que ya cargó (React 19 resetea el form
  // tras cada action; el defaultValue lo restaura).
  const values = state && !state.ok ? state.values : undefined;
  const [noReprocann, setNoReprocann] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const noReprocannId = useId();
  const acceptTermsId = useId();

  // Si el server rebota, mantenemos el estado de los checkboxes.
  useEffect(() => {
    if (values) {
      setNoReprocann(values.noReprocann);
      setAcceptTerms(values.acceptTerms);
    }
  }, [values]);

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
              defaultValue={values?.email}
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
              defaultValue={values?.firstName}
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
              defaultValue={values?.lastName}
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
              defaultValue={values?.dni}
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
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={values?.birthDate}
              required
            />
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
              defaultValue={values?.phone}
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
            defaultValue={values?.reprocannNumber}
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

      <section className="space-y-3">
        <label
          htmlFor={acceptTermsId}
          className="flex cursor-pointer items-start gap-3 rounded-sm border border-border/60 bg-card/40 p-4 transition hover:border-brand/60"
        >
          <input
            id={acceptTermsId}
            name="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            Declaro ser mayor de 18 años y acepto los{' '}
            <a
              href="/terminos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2 hover:text-brand/80"
            >
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline underline-offset-2 hover:text-brand/80"
            >
              Política de Privacidad
            </a>
            , incluido el tratamiento de mis datos de salud para validar mi REPROCANN.
          </span>
        </label>
        {errors?.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms[0]}</p>
        )}
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
