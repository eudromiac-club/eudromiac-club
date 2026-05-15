"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      gsap.from(".hero", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: root },
  );

  return (
    <main
      ref={root}
      className="mx-auto flex min-h-dvh max-w-2xl flex-col items-start justify-center gap-6 px-6 py-16"
    >
      <Badge variant="secondary">acceso por invitación</Badge>
      <h1 className="hero text-4xl font-semibold tracking-tight sm:text-5xl">
        eudromiac club
      </h1>
      <p className="text-balance text-muted-foreground">
        Stack visual base instalado: Tailwind v3.4, shadcn manual, GSAP, lucide.
        La landing animada llega en la próxima fase.
      </p>
      <Button>Solicitar invitación</Button>
    </main>
  );
}
