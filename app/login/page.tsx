import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Ingresar · EUDROMIA CLUB',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Acceso de socios
      </p>
      <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">Ingresar.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Para socios con cuenta activa. El acceso al catálogo está sujeto a tu permiso REPROCANN
        vigente. Si todavía no lo tenés, nuestro equipo médico lo gestiona con vos.
      </p>
      <div className="mt-10">
        <LoginForm />
      </div>
      <div className="mt-8 space-y-2 text-center text-xs text-muted-foreground">
        <p>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-brand underline hover:text-foreground">
            Asociarse
          </Link>
        </p>
        <p>
          ¿Tenés invitación pendiente?{' '}
          <Link href="/invitacion" className="underline hover:text-foreground">
            Canjeala acá
          </Link>
        </p>
      </div>
    </main>
  );
}
