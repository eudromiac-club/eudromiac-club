"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prefersReducedMotion } from "@/lib/animations";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });
      tl.from(".hero-badge", { y: 12, opacity: 0, duration: 0.5 })
        .from(".hero-title", { y: 24, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(
          ".hero-subtitle",
          { y: 16, opacity: 0, duration: 0.6 },
          "-=0.4",
        )
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3");
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-3xl flex-col items-start justify-center gap-6 px-6 py-20 sm:py-28"
      aria-labelledby="hero-title"
    >
      <Badge variant="secondary" className="hero-badge">
        Club privado · Acceso por invitación
      </Badge>
      <h1
        id="hero-title"
        className="hero-title text-balance text-5xl font-semibold tracking-tight sm:text-7xl"
      >
        eudromiac club
      </h1>
      <p className="hero-subtitle max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
        Asociación de socios en torno a una selección curada de cinco
        genéticas. Espacio cerrado, comunidad pequeña, atención personal.
      </p>
      <div className="hero-cta">
        <Button asChild>
          <Link href="/invitacion">Tengo una invitación</Link>
        </Button>
      </div>
    </section>
  );
}
