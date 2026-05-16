import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Ingresar — eudromiac club',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver
        </Link>
      </div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Ingresar</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Acceso para socios verificados con permiso REPROCANN vigente.
      </p>
      <LoginForm />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        ¿Tenés invitación pendiente? <Link href="/invitacion" className="underline">Canjeala acá</Link>.
      </p>
    </main>
  );
}
