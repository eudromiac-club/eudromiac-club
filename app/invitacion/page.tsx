import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Canjear invitación · eudromiac club',
  robots: { index: false, follow: false },
};

export default function InvitacionPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-6 px-6 py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Canjear invitación
      </h1>
      <p className="text-balance text-muted-foreground">
        Necesitás un link de invitación enviado por el club. Si ya tenés cuenta, ingresá desde el
        login.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Volver</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Ingresar</Link>
        </Button>
      </div>
    </main>
  );
}
