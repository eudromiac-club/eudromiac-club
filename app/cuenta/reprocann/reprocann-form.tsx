'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitReprocannAction, type SubmitReprocannState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function labelClass() {
  return 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';
}

export function ReprocannForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState<SubmitReprocannState, FormData>(
    submitReprocannAction,
    undefined,
  );
  const errors = state && !state.ok ? state.errors : undefined;
  const formError = state && !state.ok ? state.form : undefined;

  useEffect(() => {
    if (state?.ok) {
      router.push('/cuenta');
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-8" encType="multipart/form-data">
      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Datos del titular
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass()}>
              Nombre completo
            </label>
            <Input id="fullName" name="fullName" required maxLength={120} />
            {errors?.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName[0]}</p>}
          </div>
          <div>
            <label htmlFor="dni" className={labelClass()}>
              DNI
            </label>
            <Input id="dni" name="dni" inputMode="numeric" required maxLength={10} placeholder="solo números" />
            {errors?.dni && <p className="mt-1 text-xs text-destructive">{errors.dni[0]}</p>}
          </div>
          <div>
            <label htmlFor="birthDate" className={labelClass()}>
              Fecha de nacimiento
            </label>
            <Input id="birthDate" name="birthDate" type="date" required />
            {errors?.birthDate && <p className="mt-1 text-xs text-destructive">{errors.birthDate[0]}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass()}>
              Teléfono (opcional)
            </label>
            <Input id="phone" name="phone" inputMode="tel" maxLength={40} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Permiso REPROCANN
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="reprocannNumber" className={labelClass()}>
              Número de permiso
            </label>
            <Input id="reprocannNumber" name="reprocannNumber" required maxLength={60} />
            {errors?.reprocannNumber && (
              <p className="mt-1 text-xs text-destructive">{errors.reprocannNumber[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="reprocannExpiresAt" className={labelClass()}>
              Fecha de vencimiento
            </label>
            <Input id="reprocannExpiresAt" name="reprocannExpiresAt" type="date" required />
            {errors?.reprocannExpiresAt && (
              <p className="mt-1 text-xs text-destructive">{errors.reprocannExpiresAt[0]}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Médico tratante
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label htmlFor="doctorName" className={labelClass()}>
              Nombre del médico
            </label>
            <Input id="doctorName" name="doctorName" required maxLength={120} />
            {errors?.doctorName && (
              <p className="mt-1 text-xs text-destructive">{errors.doctorName[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="doctorLicense" className={labelClass()}>
              Matrícula (opcional)
            </label>
            <Input id="doctorLicense" name="doctorLicense" maxLength={60} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="doctorProvince" className={labelClass()}>
              Provincia (opcional)
            </label>
            <Input id="doctorProvince" name="doctorProvince" maxLength={60} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
          ◆ Comprobante
        </h2>
        <div>
          <label htmlFor="document" className={labelClass()}>
            Archivo del REPROCANN (PDF, JPG, PNG o WEBP — máx. 8 MB)
          </label>
          <input
            id="document"
            name="document"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp,image/heic"
            required
            className="block w-full text-sm file:mr-4 file:cursor-pointer file:rounded-none file:border file:border-brand/40 file:bg-brand/10 file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.2em] file:text-brand hover:file:bg-brand/20"
          />
          {errors?.document && <p className="mt-1 text-xs text-destructive">{errors.document[0]}</p>}
        </div>
        <div>
          <label htmlFor="notes" className={labelClass()}>
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={2000}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </section>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none px-6 py-5 text-[11px] uppercase tracking-[0.25em]"
        >
          {isPending ? 'Enviando…' : 'Enviar para revisión'}
        </Button>
        <p className="self-center text-xs text-muted-foreground">
          El equipo revisa cada solicitud uno a uno. Recibirás un aviso cuando esté lista.
        </p>
      </div>
    </form>
  );
}
