"use client";

import { useRef } from "react";

import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import { AVATAR } from "@/lib/constants";

interface EvolutionEntry {
  /** Data formatada exibida no chip (ex.: "12 Jun 2026"). */
  date: string;
  /** Nome do profissional responsável pela evolução. */
  professional: string;
  /** Especialidade do profissional. */
  specialty: string;
  /** Observação clínica em texto livre (pt-BR). */
  observation: string;
  /** Prescrições associadas (1–3). */
  prescriptions: string[];
}

/** Linha do tempo de evolução clínica — dados de exemplo realistas (pt-BR). */
const ENTRIES: EvolutionEntry[] = [
  {
    date: "12 Jun 2026",
    professional: "Dra. Helena Marques",
    specialty: "Clínica Geral",
    observation:
      "Paciente retornou para reavaliação de quadro hipertensivo. PA controlada (128/82 mmHg), refere boa adesão ao tratamento e ausência de cefaleia. Mantida conduta atual e orientado retorno em 30 dias.",
    prescriptions: ["Losartana 50mg", "Hidroclorotiazida 25mg"],
  },
  {
    date: "28 Mai 2026",
    professional: "Dr. Rafael Nunes",
    specialty: "Cardiologia",
    observation:
      "Eletrocardiograma sem alterações isquêmicas agudas. Ausculta cardíaca rítmica, bulhas normofonéticas. Solicitado ecocardiograma de controle e reforço sobre redução do consumo de sódio na dieta.",
    prescriptions: ["AAS 100mg", "Atorvastatina 20mg", "Bisoprolol 5mg"],
  },
  {
    date: "14 Mai 2026",
    professional: "Camila Andrade",
    specialty: "Nutrição",
    observation:
      "Reavaliação antropométrica com perda de 2,3 kg desde a última consulta. Paciente relata maior saciedade e melhora do hábito intestinal. Ajustado plano alimentar com foco em fibras e fracionamento das refeições.",
    prescriptions: ["Plano alimentar — 1800 kcal"],
  },
  {
    date: "02 Mai 2026",
    professional: "Dr. Bruno Teixeira",
    specialty: "Psiquiatria",
    observation:
      "Primeira consulta. Paciente apresenta sintomas ansiosos leves, sono preservado e bom suporte familiar. Iniciada abordagem psicoeducativa e encaminhamento para acompanhamento psicológico semanal.",
    prescriptions: ["Escitalopram 10mg", "Acompanhamento psicológico"],
  },
];

/**
 * Seção "Prontuário Eletrônico" — uma linha do tempo vertical de evoluções
 * clínicas. No desktop a linha conectora é desenhada (scaleY) conforme o scroll
 * e os cards ganham profundidade via parallax suave; no mobile / reduced-motion
 * tudo é um reveal escalonado simples e estático.
 */
export function RecordsTimeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ── Desktop: linha desenha no scroll + parallax de profundidade ──
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Desenho da linha conectora amarrado ao scroll da seção.
          gsap.set(".rt-line", { scaleY: 0, transformOrigin: "top center" });
          gsap.to(".rt-line", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".rt-track",
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          });

          const items = gsap.utils.toArray<HTMLElement>(".rt-item");

          items.forEach((item, i) => {
            const card = item.querySelector<HTMLElement>(".rt-card");
            const dot = item.querySelector<HTMLElement>(".rt-dot");

            // Reveal ao entrar — opacity/scale + slide (não amarrado ao scrub).
            gsap.from(card, {
              opacity: 0,
              y: 40,
              scale: 0.96,
              duration: 0.7,
              scrollTrigger: { trigger: item, start: "top 82%" },
            });

            // Pop do node dot quando a linha o alcança.
            gsap.fromTo(
              dot,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.45,
                ease: "back.out(2.2)",
                scrollTrigger: { trigger: item, start: "top 80%" },
              },
            );

            // Parallax de profundidade — cada card desliza em ritmo levemente
            // diferente (alternando o offset) durante o scroll da seção.
            const offset = i % 2 === 0 ? -28 : 22;
            gsap.fromTo(
              card,
              { y: -offset },
              {
                y: offset,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        },
      );

      // ── Mobile / reduced-motion: reveal escalonado, sem pin/scrub/parallax ──
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(".rt-line", { scaleY: 1, transformOrigin: "top center" });
        gsap.set(".rt-dot", { scale: 1, opacity: 1 });

        gsap.from(".rt-card", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: { trigger: ".rt-track", start: "top 82%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="prontuario"
      ref={root}
      className="relative overflow-hidden bg-canvas py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Prontuário Eletrônico"
          kickerIcon="ClipboardList"
          title="A evolução clínica, em uma linha do tempo limpa."
          subtitle="Acompanhe a evolução clínica dos pacientes, com prescrições organizadas."
        />

        {/* Track da timeline */}
        <div className="rt-track relative mx-auto mt-16 max-w-3xl sm:mt-20">
          {/* Linha conectora vertical à esquerda */}
          <div
            className="pointer-events-none absolute left-4 top-2 bottom-2 w-px sm:left-6"
            aria-hidden="true"
          >
            {/* Trilho de fundo (sempre visível, sutil) */}
            <div className="absolute inset-0 bg-slate-200/70" />
            {/* Linha que é desenhada no scroll */}
            <div className="rt-line absolute inset-0 bg-gradient-to-b from-primary via-primary to-teal" />
          </div>

          <ol className="space-y-8 sm:space-y-10">
            {ENTRIES.map((entry) => (
              <li
                key={`${entry.date}-${entry.professional}`}
                className="rt-item relative pl-12 sm:pl-20"
              >
                {/* Node dot na linha conectora */}
                <span
                  className="rt-dot absolute left-4 top-7 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full bg-primary ring-4 ring-canvas sm:left-6"
                  aria-hidden="true"
                />

                {/* Card de evolução */}
                <article className="rt-card ds-card p-6">
                  {/* Cabeçalho: chip de data + profissional */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="ds-pill bg-primary/10 text-primary">
                      <Icon name="CalendarDays" className="h-3.5 w-3.5" />
                      {entry.date}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/70">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={AVATAR(entry.professional)}
                          alt={`Avatar de ${entry.professional}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </span>
                      <span className="text-right sm:text-left">
                        <span className="block text-sm font-semibold text-ink">
                          {entry.professional}
                        </span>
                        <span className="block text-xs text-muted">
                          {entry.specialty}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Observação clínica */}
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {entry.observation}
                  </p>

                  {/* Prescrições */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                      <Icon name="Pill" className="h-3.5 w-3.5" />
                      Prescrições
                    </span>
                    {entry.prescriptions.map((rx) => (
                      <span
                        key={rx}
                        className="ds-pill bg-primary/10 text-primary"
                      >
                        {rx}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
