"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";

interface TrustFact {
  value: string;
  label: string;
}

/** Fatos reais do produto — sem clientes ou depoimentos inventados. */
const FACTS: TrustFact[] = [
  { value: "03", label: "Perfis de acesso (RBAC)" },
  { value: "06", label: "Módulos integrados" },
  { value: "LGPD", label: "Estrutura alinhada à lei" },
  { value: "100%", label: "Registros auditáveis" },
];

/**
 * Faixa institucional compacta entre a Hero e Recursos — não é seção
 * numerada, é um "strip" de hairlines. Esquerda: statement da parceria com
 * a CESBEN (único ponto de luz). Direita: régua de 4 fatos do produto
 * separados por hairlines verticais (grid 2x2 no mobile).
 */
export function TrustBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-trust-reveal]");
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(items, { opacity: 0, y: 24 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: { trigger: root.current, start: "top 85%" },
          });
        },
      );

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(items, { opacity: 0, y: 16 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="border-b border-t border-foreground/10 py-14 sm:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* Esquerda — statement da parceria */}
        <div data-trust-reveal className="max-w-md">
          <p className="ds-kicker">
            <Icon name="Building2" className="h-3.5 w-3.5" />
            Parceria institucional
          </p>
          <p className="mt-4 font-sans text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
            Desenvolvido em parceria com a{" "}
            <span className="text-primary">CESBEN</span> para clínicas sociais
            e comunitárias.
          </p>
        </div>

        {/* Direita — régua de fatos: 2x2 no mobile, hairlines verticais no desktop */}
        <div className="grid grid-cols-2 gap-y-10 lg:flex lg:gap-y-0 lg:divide-x lg:divide-foreground/10">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              data-trust-reveal
              className="pr-6 lg:px-8 lg:first:pl-0 lg:last:pr-0"
            >
              <span className="block font-sans text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                {fact.value}
              </span>
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-foreground/70">
                {fact.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
