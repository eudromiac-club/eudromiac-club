import type { Metadata } from 'next';
import Link from 'next/link';
import { RecuperarForm } from './recuperar-form';

export const metadata: Metadata = {
  title: 'Recuperar contraseña · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Acceso de socios
      </p>
      <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">
        Recuperar.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Ingresá el email de tu cuenta y te enviamos un link para elegir una contraseña nueva.
      </p>
      <div className="mt-10">
        <RecuperarForm />
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          ¿Te acordaste?{' '}
          <Link href="/login" className="text-brand underline hover:text-foreground">
            Volver a ingresar
          </Link>
        </p>
      </div>
    </main>
  );
}
