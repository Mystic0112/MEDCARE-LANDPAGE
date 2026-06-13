/**
 * Ponto único de registro do GSAP para toda a landing page.
 *
 * Registrar os plugins em um só lugar evita registros duplicados e
 * garante que o `useGSAP` (do pacote oficial @gsap/react) gerencie o
 * ciclo de vida das animações com cleanup automático — sem memory leaks.
 *
 * Importe SEMPRE a partir daqui:
 *   import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// `registerPlugin` é idempotente, mas só faz sentido no browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Defaults globais com a "assinatura" de movimento premium da marca.
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

export { gsap, ScrollTrigger, useGSAP };
