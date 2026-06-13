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
 * Fecho da página: um STATEMENT tipográfico gigante (sem contêiner colorido)
 * + o <footer> monocromático com logo, colunas de links e créditos.
 *
 * Revelação sutil via GSAP (sem pin/scrub/parallax preso ao scroll).
 */
export function FooterCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".cta-reveal", {
            opacity: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".cta-band", start: "top 80%" },
          });
        },
      );

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".cta-reveal", {
          opacity: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: ".cta-band", start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="footer" className="relative">
      {/* ---------- CTA final — statement tipográfico ---------- */}
      <div className="border-t border-foreground/10">
        <div className="cta-band mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-40">
          <span className="cta-reveal ds-kicker">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
            MedCare
          </span>

          <h2 className="cta-reveal mt-6 max-w-[15ch] font-sans text-[clamp(2.75rem,9vw,8rem)] font-bold uppercase leading-[0.86] tracking-tighter text-foreground">
            Cuidar ficou <span className="text-primary">inteligente</span>
          </h2>

          <p className="cta-reveal mt-8 max-w-xl text-base leading-relaxed text-foreground/60 sm:text-lg">
            Comece agora a organizar pacientes, agenda e prontuários em uma só
            plataforma. Leve, segura e feita para clínicas sociais.
          </p>

          <div className="cta-reveal mt-10 flex flex-wrap items-center gap-3">
            <a href="#inicio" className="ds-btn-primary">
              Acessar o MedCare
              <Icon name="ArrowRight" className="h-4 w-4" />
            </a>
            <a href="#footer" className="ds-btn-ghost">
              Falar com a equipe
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Rodapé ---------- */}
      <div className="border-t border-foreground/10">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* marca + tagline */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
                  <Icon name="HeartPulse" className="h-5 w-5" />
                </span>
                <span className="text-lg font-bold tracking-tight text-foreground">
                  MedCare
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/55">
                A plataforma completa para gestão de clínicas sociais e
                comunitárias.
              </p>
            </div>

            {/* colunas de links */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-foreground/55 transition-colors duration-200 hover:text-foreground"
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
          <div className="mt-12 flex flex-col gap-4 border-t border-foreground/10 pt-6 font-mono text-[11px] uppercase tracking-wider text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Desenvolvido por{" "}
              <span className="text-foreground/70">Hélio Vinícius</span> e{" "}
              <span className="text-foreground/70">Yan Seligman</span>
            </p>
            <p>© 2026 MedCare</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
