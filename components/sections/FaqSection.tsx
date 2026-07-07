"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

/** Dispara o contrato global do modal de leads. */
function openLeadModal() {
  window.dispatchEvent(new CustomEvent("medcare:lead"));
}

/** Perguntas honestas — nada de preço, clientes ou números inventados. */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "O que é o MedCare?",
    answer:
      "É uma plataforma de gestão para clínicas sociais e comunitárias. Pacientes, agendamentos, prontuário eletrônico, equipe voluntária e medicamentos ficam organizados num só lugar, com uma visão unificada da operação da clínica.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. A estrutura do sistema é alinhada à LGPD: senhas protegidas com hash Bcrypt, proteção CSRF em todos os formulários e autenticação via Laravel Sanctum. Além disso, nada crítico é apagado de verdade — os registros usam soft delete e permanecem auditáveis.",
  },
  {
    question: "Quem pode usar o sistema?",
    answer:
      "O acesso é controlado por 3 perfis com permissões próprias (RBAC): Administrador, Profissional e Secretário. Cada perfil enxerga apenas os módulos essenciais para o seu trabalho — nem mais, nem menos.",
  },
  {
    question: "Funciona para clínicas com profissionais voluntários?",
    answer:
      "Sim, o MedCare foi desenhado exatamente para esse cenário. A equipe voluntária é cadastrada por especialidade e disponibilidade, e a agenda integrada mostra os horários livres de cada profissional em segundos.",
  },
  {
    question: "Como o prontuário eletrônico funciona?",
    answer:
      "O histórico clínico e a evolução de cada paciente ficam centralizados num único prontuário. Toda alteração deixa uma trilha auditável, garantindo que nenhum registro se perca ao longo do acompanhamento.",
  },
  {
    question: "Como faço para começar a usar?",
    answer: (
      <>
        O acesso está em fase beta com instituições parceiras. Clique em{" "}
        <button
          type="button"
          onClick={openLeadModal}
          className="font-semibold text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-primary"
        >
          Solicitar acesso
        </button>{" "}
        e a equipe entra em contato para entender o momento da sua clínica.
      </>
    ),
  },
];

/**
 * #faq [06] — acordeão acessível em estilo grife: lista de hairlines
 * (divide-y), número mono [NN] à esquerda e ícone Plus que rotaciona 45°.
 * A expansão é 100% CSS (grid-rows 0fr → 1fr); o GSAP entra apenas no
 * reveal de entrada dos itens, seguindo o padrão matchMedia do projeto.
 */
export function FaqSection() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".faq-item");
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
            scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
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
    <section id="faq" ref={root} className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          kicker="Dúvidas"
          kickerIcon="MessageCircleQuestion"
          title={
            <>
              Perguntas <span className="text-primary">frequentes</span>
            </>
          }
          subtitle="O essencial sobre o MedCare, respondido sem rodeios — do funcionamento à segurança dos dados."
        />

        <div className="faq-list mt-16 divide-y divide-foreground/10 border-b border-t border-foreground/10 sm:mt-20">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question} className="faq-item">
                <h3>
                  <button
                    type="button"
                    id={`faq-trigger-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 py-6 text-left transition-colors duration-200 hover:text-foreground sm:gap-6 sm:py-7"
                  >
                    <span className="w-10 flex-none font-mono text-xs tracking-tight text-foreground/55">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span className="flex-1 font-sans text-base font-bold tracking-tight text-foreground sm:text-lg">
                      {item.question}
                    </span>
                    <Icon
                      name="Plus"
                      className={[
                        "h-4 w-4 flex-none transition-transform duration-300",
                        isOpen
                          ? "rotate-45 text-primary"
                          : "rotate-0 text-foreground/55",
                      ].join(" ")}
                    />
                  </button>
                </h3>

                {/* Painel — expansão via grid-template-rows (CSS puro).
                    `invisible` tira o painel fechado da tab order e da árvore
                    de acessibilidade; como visibility transiciona de forma
                    discreta, o conteúdo só some ao fim do collapse de 300ms. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={[
                    "grid transition-[grid-template-rows,visibility] duration-300 ease-out",
                    isOpen
                      ? "visible grid-rows-[1fr]"
                      : "invisible grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-14 pr-8 text-sm leading-relaxed text-foreground/65 sm:pl-16">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
