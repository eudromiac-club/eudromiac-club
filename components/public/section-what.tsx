"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export function SectionWhat() {
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
      aria-labelledby="what-title"
    >
      <h2
        id="what-title"
        className="reveal text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Qué es eudromiac
      </h2>
      <div className="reveal mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          Una asociación de socios pensada como espacio chico, no como mercado.
          Funciona bajo el modelo de club social: el club es de quienes lo
          integran, las decisiones son colectivas, y el acceso es controlado.
        </p>
        <p>
          Trabajamos con cinco genéticas seleccionadas. No hay catálogo
          interminable ni rotación constante: lo que está disponible está
          pensado.
        </p>
      </div>
    </section>
  );
}
