import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Canjear invitación · eudromiac club',
  robots: { index: false, follow: false },
};

export default function InvitacionPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Acceso por invitación
      </p>
      <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">Canjear.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Necesitás un link de invitación enviado por un socio del club. Si ya
        tenés cuenta, ingresá desde el login.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline" className="rounded-full px-5">
          <Link href="/">Volver</Link>
        </Button>
        <Button asChild className="rounded-full px-5">
          <Link href="/login">Ingresar</Link>
        </Button>
      </div>
    </main>
  );
}
