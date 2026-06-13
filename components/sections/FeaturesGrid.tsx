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

/** Acento focal por recurso — usado SÓ no ícone (ponto de luz). */
const ACCENT: Record<FeatureAccent, string> = {
  primary: COLORS.primary,
  teal: COLORS.teal,
  purple: COLORS.purple,
  amber: COLORS.amber,
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
 * Seção "Recursos" [01] — grade cirúrgica de linhas 1px (sem cards pesados).
 * Cada célula traz seu índice [NN] em mono e o ícone no acento da marca como
 * único ponto de luz. Revelação escalonada no scroll via GSAP (leak-free).
 */
export function FeaturesGrid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(cards, { opacity: 0, y: 32 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            scrollTrigger: { trigger: ".features-grid", start: "top 80%" },
          });
        },
      );

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { opacity: 0, y: 16 });
        gsap.to(cards, {
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
    <section id="recursos" ref={root} className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          kicker="Recursos"
          kickerIcon="Sparkles"
          title={
            <>
              Tudo num <span className="text-primary">só lugar</span>
            </>
          }
          subtitle="Uma plataforma completa para clínicas sociais e comunitárias — do agendamento ao prontuário, com a equipe e os medicamentos sempre sob controle."
        />

        <div className="features-grid mt-16 grid grid-cols-1 border-l border-t border-foreground/10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <article
              key={feature.title}
              className="feature-card relative border-b border-r border-foreground/10 p-8 transition-colors duration-300 hover:bg-foreground/[0.02] sm:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-tight text-foreground/40">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <Icon
                  name={feature.icon}
                  className="h-5 w-5"
                  style={{ color: ACCENT[feature.accent] }}
                />
              </div>

              <h3 className="mt-10 text-xl font-bold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/55">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
