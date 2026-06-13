"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { COLORS } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FeatureAccent = "primary" | "teal" | "purple" | "amber";

interface Feature {
  icon: string;
  title: string;
  desc: string;
  accent: FeatureAccent;
}

/**
 * Mapa de acento → background suave do chip + cor do ícone.
 * Usa apenas os tokens de cor do contrato (sem hexes inventados).
 */
const ACCENT: Record<FeatureAccent, { chip: string; color: string }> = {
  primary: { chip: "bg-primary-soft", color: COLORS.primary },
  teal: { chip: "bg-teal-soft", color: COLORS.teal },
  purple: { chip: "bg-purple-soft", color: COLORS.purple },
  amber: { chip: "bg-amber-soft", color: COLORS.amber },
};

/** Os 6 recursos do produto, com acentos rotacionados. */
const FEATURES: Feature[] = [
  {
    icon: "LayoutDashboard",
    title: "Dashboard em Tempo Real",
    desc: "Acompanhe pacientes, consultas e indicadores da clínica em uma visão única e sempre atualizada.",
    accent: "primary",
  },
  {
    icon: "CalendarDays",
    title: "Calendário Inteligente",
    desc: "Visualize a agenda completa da equipe e identifique horários livres em segundos.",
    accent: "teal",
  },
  {
    icon: "ClipboardList",
    title: "Prontuário Eletrônico",
    desc: "Histórico clínico e evolução de cada paciente centralizados, seguros e auditáveis.",
    accent: "purple",
  },
  {
    icon: "CalendarCheck",
    title: "Agendamento Inteligente",
    desc: "Marque consultas com confirmação automática e evite conflitos de horário.",
    accent: "amber",
  },
  {
    icon: "UserCheck",
    title: "Profissionais Voluntários",
    desc: "Cadastre e organize a equipe voluntária por especialidade e disponibilidade.",
    accent: "primary",
  },
  {
    icon: "Pill",
    title: "Catálogo de Medicamentos",
    desc: "Controle o estoque e a dispensação de medicamentos com rastreabilidade total.",
    accent: "teal",
  },
];

/**
 * Seção "Recursos" — grade responsiva (1/2/3 colunas) com os 6 diferenciais
 * da plataforma. Revelação escalonada dos cards no scroll via GSAP.
 */
export function FeaturesGrid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = ".features-heading";
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");

      const mm = gsap.matchMedia();

      // Experiência completa: revelação com stagger no desktop.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set([heading, cards], { opacity: 0, y: 32 });

          gsap.to(heading, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: { trigger: heading, start: "top 82%" },
          });

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: { trigger: ".features-grid", start: "top 78%" },
          });
        },
      );

      // Mobile / reduced-motion: revelação leve, sem stagger pesado, leak-free.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([heading, cards], { opacity: 0, y: 16 });

        gsap.to([heading, cards], {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="recursos" ref={root} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          className="features-heading"
          kicker="Recursos"
          kickerIcon="Sparkles"
          title="Tudo o que sua clínica precisa, em um só lugar."
          subtitle="Uma plataforma completa para gestão de clínicas sociais e comunitárias — do agendamento ao prontuário, com a equipe e os medicamentos sempre sob controle."
        />

        <div className="features-grid mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const accent = ACCENT[feature.accent];
            return (
              <article
                key={feature.title}
                className="feature-card ds-card p-6 transition-transform duration-300 will-change-transform hover:scale-[1.02] sm:p-7"
              >
                <span
                  className={[
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    accent.chip,
                  ].join(" ")}
                >
                  <Icon
                    name={feature.icon}
                    className="h-6 w-6"
                    style={{ color: accent.color }}
                  />
                </span>

                <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
