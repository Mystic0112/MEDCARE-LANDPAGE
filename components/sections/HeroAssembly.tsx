"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { AppSidebar } from "@/components/mockup/AppSidebar";
import { AppHeader } from "@/components/mockup/AppHeader";
import { StatCard } from "@/components/mockup/StatCard";
import { ActivityChart } from "@/components/mockup/ActivityChart";
import { BrowserFrame } from "@/components/mockup/BrowserFrame";
import { STAT_CARDS } from "@/lib/constants";

/** Rótulos dos passos da montagem (indicador opcional de progresso). */
const ASSEMBLY_STEPS = ["Sidebar", "Header", "Indicadores", "Gráfico"] as const;

/**
 * HeroAssembly — a peça central da landing.
 *
 * Acima da dobra (sempre visível): kicker, slogan, tagline e CTAs.
 * Abaixo: o dashboard MedCare montado dentro de um BrowserFrame.
 *
 * No desktop (>=768px, sem prefers-reduced-motion) a seção é fixada (pin)
 * e uma timeline com scrub monta o sistema peça por peça conforme o scroll:
 *   1. Sidebar entra pela esquerda
 *   2. Header desce do topo
 *   3. Os 3 StatCards surgem do fundo (escala) com stagger
 *   4. O gráfico sobe e as barras crescem (scaleY 0 -> 1)
 *
 * No mobile / reduced-motion: sem pin, sem scrub — o mockup já vem montado
 * e é revelado uma única vez ao entrar na viewport.
 */
export function HeroAssembly() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Helpers de seleção escopados ao root.
      const q = gsap.utils.selector(root);
      const pin = q(".assembly-pin")[0] as HTMLElement | undefined;
      const sidebar = q(".assembly-sidebar");
      const header = q(".assembly-header");
      const stats = q(".assembly-stat");
      const chart = q(".assembly-chart");
      const bars = q(".chart-bar");
      const dots = q(".assembly-dot");

      // Realça os dots de progresso até o índice atual (inclusive).
      const setActiveStep = (index: number) => {
        dots.forEach((dot, i) => {
          gsap.to(dot, {
            backgroundColor:
              i <= index ? "var(--assembly-dot-on)" : "var(--assembly-dot-off)",
            scale: i === index ? 1.35 : 1,
            duration: 0.25,
            overwrite: "auto",
          });
        });
      };

      /* ---------------------------------------------------------------
       * DESKTOP — experiência completa: pin + scrub + montagem
       * ------------------------------------------------------------- */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!pin) return;

          // Estados iniciais (antes do paint -> sem flash).
          gsap.set(sidebar, { xPercent: -120, autoAlpha: 0 });
          gsap.set(header, { yPercent: -120, autoAlpha: 0 });
          gsap.set(stats, { scale: 0.6, autoAlpha: 0, y: 40 });
          gsap.set(chart, { autoAlpha: 0, y: 30 });
          gsap.set(bars, { scaleY: 0 });
          gsap.set(dots, {
            backgroundColor: "var(--assembly-dot-off)",
            scale: 1,
          });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: "+=2600",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          // Passo 1 — Sidebar entra pela esquerda.
          tl.to(sidebar, { xPercent: 0, autoAlpha: 1, duration: 1 }, 0).add(
            () => setActiveStep(0),
            ">-0.2",
          );

          // Passo 2 — Header desce do topo.
          tl.to(
            header,
            { yPercent: 0, autoAlpha: 1, duration: 1 },
            ">+0.3",
          ).add(() => setActiveStep(1), ">-0.2");

          // Passo 3 — Os 3 StatCards surgem do fundo, com profundidade.
          tl.to(
            stats,
            {
              scale: 1,
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "back.out(1.6)",
              stagger: 0.15,
            },
            ">+0.3",
          ).add(() => setActiveStep(2), ">-0.3");

          // Passo 4 — Gráfico sobe e as barras crescem da base.
          tl.to(chart, { autoAlpha: 1, y: 0, duration: 0.8 }, ">+0.3")
            .to(
              bars,
              {
                scaleY: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.07,
              },
              ">-0.2",
            )
            .add(() => setActiveStep(3), ">-0.4");
        },
      );

      /* ---------------------------------------------------------------
       * MOBILE / REDUCED-MOTION — sem pin, sem scrub
       * Mockup já montado; revelação única ao entrar na viewport.
       * ------------------------------------------------------------- */
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        if (!pin) return;

        // Garante visibilidade total (limpa qualquer estado anterior).
        gsap.set([sidebar, header, stats, chart], {
          clearProps: "all",
          autoAlpha: 1,
        });
        gsap.set(dots, {
          backgroundColor: "var(--assembly-dot-on)",
          scale: 1,
        });

        // Revelação suave do conjunto.
        gsap.from(pin, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: pin, start: "top 80%" },
        });

        // Barras crescem uma única vez (tween normal, sem scrub).
        gsap.fromTo(
          bars,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: { trigger: chart[0], start: "top 85%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="inicio"
      className="relative overflow-hidden"
      style={
        {
          "--assembly-dot-on": "#4578FF",
          "--assembly-dot-off": "#CBD5E1",
        } as React.CSSProperties
      }
    >
      {/* Backdrop decorativo */}
      <div
        aria-hidden
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 -z-10"
      />

      {/* Wrapper centralizado — é o que fica fixado (pin) no desktop e
          precisa caber na altura da viewport. */}
      <div className="assembly-pin flex min-h-screen flex-col justify-center pb-12 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          {/* ---------------- Conteúdo acima do mockup ---------------- */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="ds-kicker">
              <Icon name="HeartPulse" className="h-3.5 w-3.5" />
              Sistema de Gestão Clínica · CESBEN
            </span>

            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
              Cuidar ficou <span className="text-gradient">mais inteligente.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-500 sm:text-lg">
              A plataforma completa para gestão de clínicas sociais e
              comunitárias.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a href="#recursos" className="ds-btn-primary">
                Conhecer o sistema
                <Icon name="ArrowRight" className="h-4 w-4" />
              </a>
              <a href="#recursos" className="ds-btn-ghost">
                Ver recursos
              </a>
            </div>
          </div>

          {/* ---------------------- O Mockup ---------------------- */}
          <div className="mx-auto mt-10 w-full max-w-5xl sm:mt-12">
            <BrowserFrame>
              <div className="no-scrollbar overflow-x-auto">
                <div className="flex min-w-[640px] gap-3 sm:gap-4">
                  {/* Esquerda — Sidebar (altura cheia da coluna do mockup) */}
                  <AppSidebar className="assembly-sidebar shrink-0 self-stretch" />

                  {/* Direita — Header + StatCards + Gráfico */}
                  <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                    <AppHeader className="assembly-header" />

                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {STAT_CARDS.map((card) => (
                        <StatCard
                          key={card.id}
                          className="assembly-stat will-change-transform"
                          title={card.title}
                          value={card.value}
                          sub={card.sub}
                          icon={card.icon}
                          accent={card.accent}
                        />
                      ))}
                    </div>

                    <ActivityChart className="assembly-chart" />
                  </div>
                </div>
              </div>
            </BrowserFrame>

            {/* Indicador de progresso da montagem (polish) */}
            <div
              aria-hidden
              className="mt-6 flex items-center justify-center gap-5"
            >
              {ASSEMBLY_STEPS.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[11px] font-semibold text-slate-400"
                >
                  <span className="assembly-dot h-2 w-2 rounded-full bg-slate-300" />
                  <span className="hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
