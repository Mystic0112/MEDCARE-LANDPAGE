"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { AppSidebar } from "@/components/mockup/AppSidebar";
import { AppHeader } from "@/components/mockup/AppHeader";
import { StatCard } from "@/components/mockup/StatCard";
import { ActivityChart } from "@/components/mockup/ActivityChart";
import { STAT_CARDS } from "@/lib/constants";

/**
 * HeroAssembly — "Component Explosion".
 *
 * Desktop (>=768px, sem reduced-motion): a seção é fixada (pin) e uma timeline
 * com scrub monta o produto:
 *   1. A Sidebar (90px) e o Header surgem (opacity 0, scale .95) e se encaixam
 *      nas BORDAS reais da viewport — emoldurando a página como o app shell.
 *   2. Os StatCards flutuam sobre o vazio (espalhados, com leve rotação) e
 *      convergem para o alinhamento conforme o scroll.
 *   3. O gráfico sobe e sua LINHA se desenha (strokeDashoffset 1 → 0).
 *
 * Mobile / reduced-motion: sem pin/scrub. O moldura é omitida; os widgets são
 * revelados uma única vez e a linha se desenha ao entrar na viewport.
 *
 * Todo o ciclo vive em `useGSAP` (cleanup automático) + `gsap.matchMedia`.
 */
export function HeroAssembly() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const sidebar = q(".hero-sidebar");
      const header = q(".hero-header");
      const stats = q(".hero-stat");
      const chart = q(".hero-chart");
      const line = q(".chart-line");
      const area = q(".chart-area");
      const dots = q(".chart-dot");

      const mm = gsap.matchMedia();

      /* ---------------- DESKTOP — pin + scrub + explosão ---------------- */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Estados iniciais (antes do paint → sem flash).
          gsap.set(sidebar, { xPercent: -130, autoAlpha: 0, scale: 0.95 });
          gsap.set(header, { yPercent: -140, autoAlpha: 0, scale: 0.95 });
          gsap.set(stats, {
            autoAlpha: 0,
            y: 130,
            x: (i: number) => (i - 1) * 64,
            rotation: (i: number) => (i - 1) * 5,
            scale: 0.9,
          });
          gsap.set(chart, { autoAlpha: 0, y: 170, scale: 0.92 });
          gsap.set(area, { autoAlpha: 0 });
          gsap.set(line, { strokeDashoffset: 1 });
          gsap.set(dots, { autoAlpha: 0, scale: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".hero-pin",
              start: "top top",
              end: "+=160%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          // 1 — moldura encaixa nas bordas da viewport.
          tl.to(sidebar, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 1 }, 0)
            .to(
              header,
              { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1 },
              0.1,
            )
            // 2 — StatCards flutuam e convergem.
            .to(
              stats,
              {
                autoAlpha: 1,
                y: 0,
                x: 0,
                rotation: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "back.out(1.4)",
              },
              0.5,
            )
            // 3 — gráfico sobe e a linha se desenha.
            .to(chart, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 }, 1.1)
            .to(area, { autoAlpha: 1, duration: 0.6 }, 1.35)
            .to(line, { strokeDashoffset: 0, duration: 1.5, ease: "none" }, 1.35)
            .to(
              dots,
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.08,
                ease: "back.out(2)",
              },
              1.9,
            );
        },
      );

      /* ----------- MOBILE / REDUCED-MOTION — sem pin/scrub ----------- */
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([...stats, ...chart], { clearProps: "all" });
        gsap.set(area, { autoAlpha: 1 });
        gsap.set(dots, { autoAlpha: 1, scale: 1 });

        gsap.from(stats, {
          autoAlpha: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hero-stage", start: "top 85%" },
        });
        gsap.from(chart, {
          autoAlpha: 0,
          y: 28,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hero-chart", start: "top 90%" },
        });
        gsap.fromTo(
          line,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "none",
            scrollTrigger: { trigger: ".hero-chart", start: "top 88%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="inicio" className="relative">
      <div className="hero-pin relative min-h-screen w-full overflow-hidden">
        {/* Backdrop — grade cirúrgica */}
        <div
          aria-hidden
          className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 -z-10"
        />

        {/* MOLDURA — encaixa nas bordas reais da viewport (desktop) */}
        <div className="hero-sidebar pointer-events-none absolute bottom-5 left-5 top-5 z-20 hidden will-change-transform md:block">
          <AppSidebar className="h-full" />
        </div>
        <div className="hero-header pointer-events-none absolute left-28 right-5 top-5 z-20 hidden will-change-transform md:block">
          <AppHeader title="MedCare" />
        </div>

        {/* Conteúdo — recuado para liberar a moldura no desktop */}
        <div className="relative z-10 flex min-h-screen items-center px-5 pb-16 pt-28 sm:px-8 md:pl-32 md:pr-10 md:pt-32">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
            {/* Copy */}
            <div className="hero-copy">
              <span className="ds-kicker">
                <Icon name="HeartPulse" className="h-3.5 w-3.5" />
                Sistema de Gestão Clínica
              </span>

              <h1 className="mt-6 font-sans text-[clamp(2.75rem,6vw,5.5rem)] font-bold uppercase leading-[0.88] tracking-tighter text-foreground">
                Cuidar ficou <span className="text-primary">inteligente</span>
              </h1>

              <p className="mt-7 max-w-md text-balance text-base leading-relaxed text-foreground/60 sm:text-lg">
                A plataforma completa para gestão de clínicas sociais e
                comunitárias.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                {/* Abre o modal de captação de leads (LeadFormModal). */}
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("medcare:lead"))
                  }
                  className="ds-btn-primary"
                >
                  Solicitar acesso
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </button>
                <a href="#recursos" className="ds-btn-ghost">
                  Ver recursos
                </a>
              </div>
            </div>

            {/* Stage — widgets flutuantes que se montam */}
            <div className="hero-stage">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {STAT_CARDS.map((card) => (
                  <StatCard
                    key={card.id}
                    className="hero-stat will-change-transform"
                    title={card.title}
                    value={card.value}
                    sub={card.sub}
                    icon={card.icon}
                    accent={card.accent}
                  />
                ))}
              </div>
              <ActivityChart className="hero-chart mt-3 will-change-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
