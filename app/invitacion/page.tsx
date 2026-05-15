import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Canjear invitación · eudromiac club",
};

export default function InvitacionPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-6 px-6 py-16">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Canjear invitación
      </h1>
      <p className="text-balance text-muted-foreground">
        El canje de códigos llega en la próxima fase. Si tenés una
        invitación, esperá unos días o escribí al contacto del club.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Volver</Link>
      </Button>
    </main>
  );
}
