"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    title: "Comunidad pequeña",
    body: "El número de socios se mantiene acotado a propósito. Conocemos a quienes integran el club.",
  },
  {
    title: "Curaduría",
    body: "Cinco genéticas, no cien. Cada una tiene un porqué y se mantiene mientras tenga sentido.",
  },
  {
    title: "Cuidado del proceso",
    body: "Atención al cultivo, al espacio y a la relación con cada socio. Sin prisa, sin promesas vacías.",
  },
];

export function SectionPhilosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const heading = root.current?.querySelector(".reveal-heading");
      const cards = root.current?.querySelectorAll(".reveal-card");

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (heading) {
        tl.from(heading, { y: 24, opacity: 0, duration: 0.7 });
      }
      if (cards && cards.length > 0) {
        tl.from(
          cards,
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        );
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="bg-muted/30 py-20 sm:py-28"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2
          id="philosophy-title"
          className="reveal-heading text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Cómo trabajamos
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} className="reveal-card">
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
                <CardDescription className="text-balance leading-relaxed">
                  {value.body}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
