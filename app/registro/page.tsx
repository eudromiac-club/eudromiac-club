import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/dal';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Asociarse · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect('/cuenta');

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        ← Volver al inicio
      </Link>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Solicitud de ingreso
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium uppercase tracking-[0.08em] sm:text-5xl">
        <span className="text-brand">Asociarse</span>.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Cargá tus datos y tu número de trámite REPROCANN. Si todavía no lo tenés, nuestro equipo
        médico lo gestiona con vos. Después subís el comprobante desde tu cuenta y validamos tu
        acceso al dispensario.
      </p>

      <div className="mt-10">
        <RegisterForm />
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-brand underline hover:text-foreground">
            Iniciar sesión
          </Link>
        </span>
        <span>
          ¿Tenés un link de invitación?{' '}
          <Link href="/invitacion" className="text-brand underline hover:text-foreground">
            Canjealo acá
          </Link>
        </span>
      </div>
    </main>
  );
}
