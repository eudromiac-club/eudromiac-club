"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AGE_GATE_COOKIE, AGE_GATE_MAX_AGE_DAYS } from "@/lib/age-gate";

export function AgeGateModal() {
  const [open, setOpen] = useState(true);
  const [denied, setDenied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const focusables = node.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function confirm() {
    const seconds = AGE_GATE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${AGE_GATE_COOKIE}=1; path=/; max-age=${seconds}; samesite=lax`;
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
      >
        {!denied ? (
          <>
            <h2
              id="age-gate-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Acceso para mayores de 18
            </h2>
            <p
              id="age-gate-desc"
              className="mt-3 text-sm text-muted-foreground"
            >
              Esta web es de un club privado de socios. Para entrar, confirmá
              que sos mayor de edad.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setDenied(true)}>
                Soy menor
              </Button>
              <Button ref={confirmRef} onClick={confirm}>
                Tengo +18, entrar
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2
              id="age-gate-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Volvé cuando cumplas 18
            </h2>
            <p
              id="age-gate-desc"
              className="mt-3 text-sm text-muted-foreground"
            >
              Por ley no podés acceder a esta web hasta entonces. Podés cerrar
              esta pestaña.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
