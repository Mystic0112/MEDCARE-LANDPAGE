"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "./Icon";

interface SectionHeadingProps {
  /** Número do capítulo, ex.: "01" → renderiza [01]. */
  index?: string;
  /** Eyebrow curto (ex.: "Recursos"). */
  kicker?: string;
  /** Ícone Lucide opcional ao lado do kicker. */
  kickerIcon?: string;
  /** Título — GIGANTE e cru. Embrulhe UMA palavra em acento para o ponto de luz. */
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Legado — o layout agora é sempre editorial à esquerda. */
  align?: "center" | "left";
  /** Sobre fundo invertido (banda preta/branca). */
  light?: boolean;
  /** Sentido do parallax tipográfico horizontal. */
  direction?: "left" | "right";
  className?: string;
}

/**
 * Cabeçalho editorial de seção:
 *   [NN] ──  KICKER
 *   TÍTULO GIGANTE UPPERCASE
 *   subtítulo
 *
 * O título sofre um parallax tipográfico horizontal puro (translateX no scroll,
 * scrub) — ele "cruza" a tela em ritmo próprio. Toda a animação vive num
 * `useGSAP` escopado com `matchMedia` (desktop apenas; mobile/reduced-motion
 * recebem um reveal simples). Cleanup automático, sem leaks.
 */
export function SectionHeading({
  index,
  kicker,
  kickerIcon,
  title,
  subtitle,
  light = false,
  direction = "left",
  className = "",
}: SectionHeadingProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const titleEl = q(".sh-title");
      const meta = q(".sh-meta");
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Reveal de entrada (opacity/Y) — independente do X do parallax.
          gsap.from(meta, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 82%" },
          });
          gsap.from(titleEl, {
            opacity: 0,
            duration: 0.9,
            scrollTrigger: { trigger: root.current, start: "top 82%" },
          });

          // Parallax tipográfico horizontal puro (scrub atrelado ao scroll).
          const dir = direction === "right" ? -1 : 1;
          gsap.fromTo(
            titleEl,
            { xPercent: dir * 6 },
            {
              xPercent: dir * -6,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        },
      );

      // Mobile / reduced-motion — reveal simples, sem parallax.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from([...meta, ...titleEl], {
          opacity: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const fg = light ? "text-background" : "text-foreground";
  const dim = light ? "text-background/70" : "text-foreground/70";
  const sub = light ? "text-background/70" : "text-foreground/65";

  return (
    <div ref={root} className={["w-full", className].join(" ")}>
      {/* [NN] ── KICKER */}
      <div
        className={[
          "sh-meta flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.25em]",
          dim,
        ].join(" ")}
      >
        {index && <span>[{index}]</span>}
        {(kicker || kickerIcon) && (
          <span className="h-px w-8 bg-current opacity-40" />
        )}
        {kickerIcon && <Icon name={kickerIcon} className="h-3.5 w-3.5" />}
        {kicker && <span>{kicker}</span>}
      </div>

      {/* Título gigante e cru */}
      <h2
        className={[
          "sh-title mt-5 max-w-[18ch] font-sans font-bold uppercase leading-[0.9] tracking-tighter",
          "text-[clamp(2.5rem,8vw,7rem)]",
          fg,
        ].join(" ")}
        style={{ willChange: "transform" }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={[
            "sh-meta mt-6 max-w-xl text-balance font-sans text-base leading-relaxed sm:text-lg",
            sub,
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
