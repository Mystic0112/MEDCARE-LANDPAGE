"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { COLORS, STATUS_META } from "@/lib/constants";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Pontos de validação automática listados ao lado da headline. */
const VALIDATION_POINTS: string[] = [
  "Valida o dia da semana do profissional",
  "Confere se o horário está dentro do expediente (08:00–17:00)",
  "Feedback instantâneo antes de salvar",
];

/** Campos (read-only) do modal "Novo Agendamento". */
const FORM_FIELDS: { label: string; value: string; icon: string }[] = [
  { label: "Paciente", value: "Maria Souza", icon: "User" },
  { label: "Profissional", value: "Dr. Hélio · Fisioterapia", icon: "UserCheck" },
  { label: "Data", value: "Qui, 18 Jun 2026", icon: "CalendarDays" },
  { label: "Horário", value: "09:30", icon: "Clock" },
];

/** Linhas do painel de validação que "acendem" em teal. */
const VALIDATION_ROWS: string[] = [
  "Atende às quintas-feiras",
  "Dentro do expediente",
];

/**
 * Seção "Agendamento Inteligente" [02]: headline editorial + pontos de
 * validação à esquerda; à direita, um mockup do modal "Novo Agendamento" cujo
 * painel de validação acende (teal — ponto de luz) e cuja badge faz morph de
 * `aguardando` → `confirmado` ao entrar em viewport. Superfícies em hairline.
 */
export function SchedulingFlow() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Constrói a timeline de "morph" (rows acendem → badge crossfade).
      // Reutilizada por desktop e mobile com gatilhos diferentes.
      const buildTimeline = (paused: boolean) => {
        const tl = gsap.timeline({ paused, defaults: { ease: "power3.out" } });

        // Estado inicial: checks apagados, badge confirmado escondido.
        gsap.set(".check-mark", { autoAlpha: 0, scale: 0.4 });
        gsap.set(".badge-confirmado", { autoAlpha: 0, scale: 0.85 });
        gsap.set(".badge-aguardando", { autoAlpha: 1, scale: 1 });

        // 1) As duas linhas de validação dão check, uma após a outra.
        tl.to(".validation-row", {
          backgroundColor: "rgba(0, 194, 199, 0.14)",
          duration: 0.4,
          stagger: 0.25,
        })
          .to(
            ".check-mark",
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.45,
              ease: "back.out(2.2)",
              stagger: 0.25,
            },
            "<",
          )
          // 2) Só DEPOIS dos checks: a badge faz o morph.
          .to(
            ".badge-aguardando",
            { autoAlpha: 0, scale: 0.85, duration: 0.35 },
            "+=0.15",
          )
          .to(
            ".badge-confirmado",
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
            "<0.1",
          );

        return tl;
      };

      // DESKTOP — experiência completa: revela colunas + toca o morph on-enter.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".reveal-col", {
            opacity: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.12,
            scrollTrigger: { trigger: root.current, start: "top 75%" },
          });

          // Play-on-enter (sem scrub) para clareza da sequência de validação.
          const tl = buildTimeline(true);
          ScrollTriggerPlay(tl);
        },
      );

      // MOBILE / reduced-motion — toca uma vez ao entrar, sem pin/scrub.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".reveal-col", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });

        const tl = buildTimeline(true);
        ScrollTriggerPlay(tl);
      });

      // Helper local: anexa um ScrollTrigger play-on-enter à timeline.
      function ScrollTriggerPlay(tl: gsap.core.Timeline) {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".mock-card",
            start: "top 65%",
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          },
        });
      }
    },
    { scope: root },
  );

  const teal = STATUS_META.confirmado.dot;

  return (
    <section id="agendamento" ref={root} className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT — headline + pontos de validação */}
          <div className="reveal-col">
            <SectionHeading
              index="02"
              kicker="Agendamento Inteligente"
              kickerIcon="CalendarCheck"
              title={
                <>
                  O sistema <span className="text-primary">sabe</span> quando
                </>
              }
              subtitle="Validação automática de dia e horário em cada agendamento: o sistema confere a agenda do profissional e o expediente da clínica antes de você salvar."
            />

            <ul className="mt-10 flex flex-col gap-4">
              {VALIDATION_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-teal/15"
                    aria-hidden
                  >
                    <Icon
                      name="Check"
                      className="h-3.5 w-3.5"
                      style={{ color: teal }}
                    />
                  </span>
                  <span className="text-base leading-relaxed text-foreground/70">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — mockup do modal "Novo Agendamento" */}
          <div className="reveal-col">
            <div className="mock-card border border-foreground/10 bg-transparent p-6">
              {/* Cabeçalho do modal */}
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-foreground/10">
                  <Icon
                    name="CalendarPlus"
                    className="h-5 w-5"
                    style={{ color: COLORS.primary }}
                  />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Novo Agendamento
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                    Preencha os dados da consulta
                  </p>
                </div>
              </div>

              {/* Campos (read-only look) */}
              <div className="mt-6 flex flex-col gap-3">
                {FORM_FIELDS.map((field) => (
                  <div key={field.label} className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                      {field.label}
                    </span>
                    <div className="flex items-center gap-2.5 rounded-xl border border-foreground/10 px-3.5 py-2.5">
                      <Icon
                        name={field.icon}
                        className="h-4 w-4 flex-none text-foreground/50"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {field.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Painel de validação — linhas que acendem em teal */}
              <div className="mt-6 flex flex-col gap-2.5">
                {VALIDATION_ROWS.map((row) => (
                  <div
                    key={row}
                    className="validation-row flex items-center gap-2.5 rounded-xl border border-foreground/10 px-3.5 py-2.5"
                  >
                    <span
                      className="check-mark grid h-5 w-5 flex-none place-items-center rounded-full"
                      style={{ backgroundColor: teal }}
                      aria-hidden
                    >
                      <Icon name="Check" className="h-3 w-3 text-white" />
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              {/* Área de status — duas badges empilhadas que fazem crossfade */}
              <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/50">
                  Status
                </span>
                <span className="relative inline-grid">
                  <span className="badge-aguardando col-start-1 row-start-1">
                    <StatusBadge status="aguardando" />
                  </span>
                  <span className="badge-confirmado col-start-1 row-start-1">
                    <StatusBadge status="confirmado" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
