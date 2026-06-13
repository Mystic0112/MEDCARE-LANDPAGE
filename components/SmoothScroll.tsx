"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Rolagem suavizada (Lenis) com damping.
 *
 * Amortece e reduz a velocidade do scroll, dando o ritmo cinematográfico da
 * direção de arte (a página "desce" de forma controlada, não aos saltos).
 * Integrada ao GSAP ScrollTrigger — o pin da Hero, os parallax e as timelines
 * continuam perfeitamente sincronizados — via `gsap.ticker`.
 *
 * Acessibilidade: respeita `prefers-reduced-motion` — quando o usuário pede
 * menos movimento, o Lenis NÃO é inicializado e o scroll nativo é mantido.
 *
 * Ajuste fino (mais lento ⇄ mais ágil):
 *   • lerp            menor  → mais suave/"pesado"  (0–1, padrão 0.1)
 *   • wheelMultiplier menor  → cada giro da roda anda menos (< 1 = mais lento)
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.8,
      smoothWheel: true,
      anchors: { offset: -90 }, // âncoras (#secao) com scroll suave, limpando a navbar fixa
    });

    // Mantém o ScrollTrigger sincronizado a cada frame do Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restaura o padrão do GSAP
      lenis.destroy();
    };
  }, []);

  return null;
}
