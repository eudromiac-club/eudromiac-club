"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export function SectionAccess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const targets = root.current?.querySelectorAll(".reveal");
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="mx-auto max-w-3xl px-6 py-20 sm:py-28"
      aria-labelledby="access-title"
    >
      <h2
        id="access-title"
        className="reveal text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Acceso por invitación
      </h2>
      <p className="reveal mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
        El ingreso al club es nominal y por invitación de un socio activo. No
        aceptamos solicitudes abiertas ni hay lista de espera pública. Si te
        invitaron, ingresá tu código en el siguiente paso.
      </p>
      <div className="reveal mt-8">
        <Button asChild variant="outline">
          <Link href="/invitacion">Canjear invitación</Link>
        </Button>
      </div>
    </section>
  );
}
