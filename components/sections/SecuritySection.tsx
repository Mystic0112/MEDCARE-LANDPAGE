"use client";

import { useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COLORS, SECURITY_FEATURES } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * #seguranca [05] — banda INVERTIDA de alto contraste (bg-foreground /
 * text-background): preta na página clara, branca na página escura. As linhas
 * cirúrgicas usam border-background/10. Os ícones dos 4 diferenciais são os
 * únicos pontos de cor (primary · teal · purple · amber).
 *
 * O título se anima sozinho (SectionHeading); aqui o GSAP só revela os cards.
 */

/** Cores de ícone rotacionadas pelos 4 cards (HEX para estilos inline). */
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
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(cards, { opacity: 0, y: 28 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });
        },
      );

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { opacity: 0, y: 16 });
        gsap.to(cards, {
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
      className="relative overflow-hidden bg-foreground py-28 text-background sm:py-40"
    >
      {/* Halo radial — brilho primário difuso no topo (acento) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[640px] max-w-full -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${COLORS.primary}22 0%, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          light
          index="05"
          kicker="Segurança de Dados"
          kickerIcon="ShieldCheck"
          title={
            <>
              Protegido em <span className="text-primary">camadas</span>
            </>
          }
          subtitle="Do CPF ao diagnóstico, cada informação de paciente é cifrada, validada e auditada — segurança que você não vê, mas na qual pode confiar."
        />

        <div className="mt-16 grid grid-cols-1 border-l border-t border-background/10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY_FEATURES.map((feature, i) => (
            <article
              key={feature.title}
              data-security-card
              className="relative border-b border-r border-background/10 p-8 transition-colors duration-300 hover:bg-background/[0.03]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-tight text-background/40">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <Icon
                  name={feature.icon}
                  className="h-5 w-5"
                  style={{ color: ACCENTS[i % ACCENTS.length] }}
                />
              </div>

              <h3 className="mt-10 text-base font-bold text-background">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-background/60">
                {feature.desc}
              </p>
            </article>
          ))}

          {/* Faixa de conformidade — atrelados à LGPD (linha cheia da grade) */}
          <div
            data-security-card
            className="col-span-1 flex flex-col gap-4 border-b border-r border-background/10 p-8 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-4"
          >
            <div className="flex items-center gap-3">
              <Icon
                name="Scale"
                className="h-5 w-5 flex-none"
                style={{ color: COLORS.primary }}
              />
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-background/80">
                Em conformidade com a LGPD
              </span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-background/60">
              Somos atrelados à Lei Geral de Proteção de Dados — coleta,
              consentimento, tratamento e auditoria das informações de pacientes
              seguem rigorosamente a legislação brasileira de proteção de dados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
