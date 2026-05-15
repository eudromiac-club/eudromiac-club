import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-start justify-center gap-6 px-6 py-16">
      <Badge variant="secondary">acceso por invitación</Badge>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        eudromiac club
      </h1>
      <p className="text-balance text-muted-foreground">
        Stack visual base instalado: Tailwind v3.4, shadcn manual, lucide.
        La landing animada con GSAP llega en la próxima fase.
      </p>
      <Button>Solicitar invitación</Button>
    </main>
  );
}
