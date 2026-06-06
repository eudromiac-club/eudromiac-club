import type { Metadata } from 'next';
import Link from 'next/link';
import { findValidResetToken } from '@/lib/auth/password-reset';
import { ResetForm } from './reset-form';

export const metadata: Metadata = {
  title: 'Nueva contraseña · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default async function ResetTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await findValidResetToken(token);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Acceso de socios
      </p>
      <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">
        Nueva clave.
      </h1>

      {valid ? (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            Elegí una contraseña nueva para tu cuenta. Mínimo 8 caracteres.
          </p>
          <div className="mt-10">
            <ResetForm token={token} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            Este link no es válido o ya venció (duran 1 hora y se usan una sola vez). Pedí uno
            nuevo y revisá tu email.
          </p>
          <div className="mt-10">
            <Link
              href="/recuperar"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Pedir un link nuevo
            </Link>
          </div>
        </>
      )}

      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          <Link href="/login" className="text-brand underline hover:text-foreground">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </main>
  );
}
