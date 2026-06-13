"use client";

import { useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COLORS, SECURITY_FEATURES } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * #seguranca — banda escura (bg-ink) para contraste premium.
 *
 * Headline em modo `light` + grid 2x2 (md) / 4 colunas (lg) de cards de
 * vidro escuro com os 4 diferenciais de SECURITY_FEATURES. Cada card recebe
 * um chip de cor rotacionada (primary · teal · purple · amber).
 *
 * Animação: reveal escalonado no scroll (desktop) / fade-slide leve no
 * mobile e em prefers-reduced-motion. Gerenciada por useGSAP (sem leaks).
 */

/** Cores de chip rotacionadas pelos 4 cards (HEX para estilos inline). */
const ACCENTS = [
  COLORS.primary,
  COLORS.teal,
  COLORS.purple,
  COLORS.amber,
] as const;

export function SecuritySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-security-card]");
      const heading = "[data-security-heading]";

      const mm = gsap.matchMedia();

      // Desktop: reveal escalonado, atrelado ao scroll de entrada.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(heading, { opacity: 0, y: 24 });
          gsap.set(cards, { opacity: 0, y: 28 });

          gsap.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });
        },
      );

      // Mobile / reduced-motion: reveal leve, sem pin/scrub/parallax.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([heading, ...cards], { opacity: 0, y: 16 });

        gsap.to([heading, ...cards], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="seguranca"
      className="py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-panel bg-ink px-6 py-16 sm:px-12 sm:py-20">
          {/* Grade branca sutil (o .bg-grid padrão usa linhas escuras, invisíveis aqui) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 0%, #000 55%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 0%, #000 55%, transparent 100%)",
            }}
          />

          {/* Halo radial — brilho primário difuso no topo */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[640px] max-w-full -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${COLORS.primary}33 0%, transparent 70%)`,
            }}
          />

          <div className="relative">
            <div data-security-heading>
              <SectionHeading
                light
                kicker="Segurança de Dados"
                kickerIcon="ShieldCheck"
                title="Dados sensíveis protegidos em todas as camadas."
                subtitle="Do CPF ao diagnóstico, cada informação de paciente é cifrada, validada e auditada — segurança que você não vê, mas na qual pode confiar."
              />
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {SECURITY_FEATURES.map((feature, i) => {
                const color = ACCENTS[i % ACCENTS.length];
                return (
                  <article
                    key={feature.title}
                    data-security-card
                    className="rounded-card bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.08] hover:ring-white/20"
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl"
                      style={{ backgroundColor: `${color}26` }}
                    >
                      <Icon
                        name={feature.icon}
                        className="h-5 w-5"
                        style={{ color }}
                      />
                    </span>

                    <h3 className="mt-5 text-base font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {feature.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
