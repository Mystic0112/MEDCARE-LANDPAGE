"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

/** Colunas de links do rodapé — apontam para as âncoras reais das seções. */
const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Agendamento", href: "#agendamento" },
      { label: "Prontuário", href: "#prontuario" },
    ],
  },
  {
    heading: "Acesso",
    links: [
      { label: "Perfis", href: "#acesso" },
      { label: "Segurança", href: "#seguranca" },
    ],
  },
];

/**
 * Fecho da página: banda de CTA final (painel com gradiente da marca,
 * sobreposto ao rodapé) + <footer> com logo, tagline, colunas de links
 * e a linha de créditos / copyright.
 *
 * Revelação sutil via GSAP: no desktop a banda sobe suavemente ao entrar
 * em viewport; no mobile / reduced-motion, um fade discreto. Sem pin,
 * sem scrub, sem parallax preso ao scroll.
 */
export function FooterCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".cta-band", {
            opacity: 0,
            y: 56,
            scale: 0.97,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".cta-band",
              start: "top 85%",
            },
          });
          gsap.from(".cta-reveal", {
            opacity: 0,
            y: 24,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".cta-band",
              start: "top 80%",
            },
          });
        },
      );

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".cta-band", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-band",
            start: "top 88%",
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="footer" className="relative">
      {/* ---------- CTA final (sobreposta ao rodapé) ---------- */}
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="cta-band relative z-10 overflow-hidden rounded-panel bg-gradient-to-br from-primary via-primary to-purple px-6 py-16 text-center shadow-float sm:px-12 sm:py-20">
          {/* halos decorativos */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-teal/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <span className="cta-reveal ds-kicker bg-white/10 text-white/80 ring-white/15">
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              MedCare
            </span>

            <h2 className="cta-reveal mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Cuidar ficou mais inteligente.
            </h2>

            <p className="cta-reveal mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              Comece agora a organizar pacientes, agenda e prontuários em uma só
              plataforma. Leve, segura e feita para clínicas sociais.
            </p>

            <div className="cta-reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#inicio"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-float transition-all duration-300 hover:scale-[1.02] hover:bg-slate-50 active:scale-[0.99]"
              >
                Acessar o MedCare
                <Icon name="ArrowRight" className="h-4 w-4" />
              </a>
              <a
                href="#footer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 active:scale-[0.99]"
              >
                Falar com a equipe
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Rodapé ---------- */}
      <div className="relative -mt-16 bg-white pt-28 ring-1 ring-slate-200/60">
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* marca + tagline */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft">
                  <Icon name="HeartPulse" className="h-5 w-5 text-primary" />
                </span>
                <span className="text-lg font-extrabold tracking-tight text-ink">
                  MedCare
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                A plataforma completa para gestão de clínicas sociais e
                comunitárias.
              </p>
            </div>

            {/* colunas de links */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* linha inferior: créditos + copyright */}
          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-relaxed text-slate-400">
              <p>
                Desenvolvido por{" "}
                <span className="font-semibold text-slate-500">
                  Hélio Vinícius
                </span>{" "}
                e{" "}
                <span className="font-semibold text-slate-500">
                  Yan Seligman
                </span>
              </p>
              <p className="mt-0.5">
                CESBEN — Centro Social de Beneficência
              </p>
            </div>
            <p className="text-xs text-slate-400">
              © 2026 MedCare. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
