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
 * Seção "Prontuário Eletrônico" [03] — linha do tempo vertical de evoluções.
 * No desktop a linha conectora (acento) é desenhada (scaleY) conforme o scroll
 * e os cards ganham profundidade via parallax suave; no mobile / reduced-motion
 * tudo é um reveal escalonado simples. Cards = hairline 1px, sem peso.
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
      className="relative overflow-hidden py-28 sm:py-40"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          kicker="Prontuário Eletrônico"
          kickerIcon="ClipboardList"
          direction="right"
          title={
            <>
              A evolução <span className="text-primary">clínica</span>
            </>
          }
          subtitle="Acompanhe a evolução clínica dos pacientes, com prescrições organizadas, em uma linha do tempo limpa."
        />

        {/* Track da timeline */}
        <div className="rt-track relative mx-auto mt-16 max-w-3xl sm:mt-20">
          {/* Linha conectora vertical à esquerda */}
          <div
            className="pointer-events-none absolute bottom-2 left-4 top-2 w-px sm:left-6"
            aria-hidden="true"
          >
            {/* Trilho de fundo (hairline) */}
            <div className="absolute inset-0 bg-foreground/10" />
            {/* Linha de acento desenhada no scroll */}
            <div className="rt-line absolute inset-0 bg-gradient-to-b from-primary via-primary to-teal" />
          </div>

          <ol className="space-y-8 sm:space-y-10">
            {ENTRIES.map((entry) => (
              <li
                key={`${entry.date}-${entry.professional}`}
                className="rt-item relative pl-12 sm:pl-20"
              >
                {/* Node dot — ponto de luz na linha */}
                <span
                  className="rt-dot absolute left-4 top-7 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background sm:left-6"
                  aria-hidden="true"
                />

                {/* Card de evolução — hairline */}
                <article className="rt-card border border-foreground/10 bg-transparent p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground/60">
                      <Icon name="CalendarDays" className="h-3.5 w-3.5" />
                      {entry.date}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-foreground/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={AVATAR(entry.professional)}
                          alt={`Avatar de ${entry.professional}`}
                          className="h-full w-full object-cover opacity-90"
                          loading="lazy"
                        />
                      </span>
                      <span className="text-right sm:text-left">
                        <span className="block text-sm font-semibold text-foreground">
                          {entry.professional}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                          {entry.specialty}
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                    {entry.observation}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/50">
                      <Icon name="Pill" className="h-3.5 w-3.5" />
                      Prescrições
                    </span>
                    {entry.prescriptions.map((rx) => (
                      <span
                        key={rx}
                        className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[11px] tracking-wide text-foreground/70"
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
