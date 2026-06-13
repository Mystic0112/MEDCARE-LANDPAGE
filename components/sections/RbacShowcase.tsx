"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AppHeader } from "@/components/mockup/AppHeader";
import { AppSidebar } from "@/components/mockup/AppSidebar";
import { BrowserFrame } from "@/components/mockup/BrowserFrame";
import {
  COLORS,
  NAV_ITEMS,
  ROLES,
  STATUS_META,
  type RoleKey,
} from "@/lib/constants";

/**
 * Seção "Controle de Acesso" (#acesso).
 *
 * Demonstra o RBAC granular do MedCare: o visitante alterna entre os três
 * papéis (Administrador, Profissional, Secretário) e vê, em tempo real, quais
 * módulos cada perfil enxerga.
 *
 * - ESQUERDA: mockup do sistema (BrowserFrame + AppHeader + AppSidebar). Ao
 *   trocar de papel, os itens da sidebar permitidos ficam nítidos (autoAlpha 1,
 *   scale 1) e os negados ficam apagados/"bloqueados" (autoAlpha 0.18, scale
 *   0.9), animados via GSAP.
 * - DIREITA: cartão de descrição do papel + lista dos 6 módulos com check
 *   (teal) quando permitido e cadeado (muted) quando negado — derivada do React
 *   state, re-renderiza a cada troca.
 *
 * A animação de visibilidade roda dentro de `useGSAP` com
 * `dependencies: [selectedRole]`, então o contexto reverte e re-executa
 * limpo a cada troca de papel (sem leaks, sem cleanup manual).
 */
export function RbacShowcase() {
  const root = useRef<HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey>("admin");

  const activeRole =
    ROLES.find((r) => r.key === selectedRole) ?? ROLES[0];
  const allowed = activeRole.allowed;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Estado-alvo de cada item da sidebar conforme o papel selecionado.
      const apply = (animate: boolean) => {
        NAV_ITEMS.forEach((item) => {
          const isAllowed = allowed.includes(item.id);
          const target = `[data-nav="${item.id}"]`;
          const vars = {
            autoAlpha: isAllowed ? 1 : 0.18,
            scale: isAllowed ? 1 : 0.9,
          };
          if (animate) {
            gsap.to(target, {
              ...vars,
              duration: 0.4,
              ease: "power2.out",
            });
          } else {
            gsap.set(target, vars);
          }
        });
      };

      // Reveal único da seção ao entrar na viewport.
      const revealTargets = ".rbac-reveal";

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          apply(true);

          gsap.from(revealTargets, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: root.current,
              start: "top 78%",
              once: true,
            },
          });
        },
      );

      mm.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce)",
        () => {
          // Sem scrub/pin/parallax: estado de visibilidade aplicado de imediato
          // e reveal simples por opacidade.
          apply(false);

          gsap.from(revealTargets, {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: root.current,
              start: "top 85%",
              once: true,
            },
          });
        },
      );
    },
    { scope: root, dependencies: [selectedRole] },
  );

  return (
    <section id="acesso" ref={root} className="bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Controle de Acesso"
          kickerIcon="ShieldCheck"
          title="Cada perfil vê exatamente o que precisa."
          subtitle="Permissões granulares por papel (RBAC): o sistema revela apenas os módulos relevantes para cada pessoa da clínica — menos ruído, mais segurança e zero acesso indevido."
        />

        {/* Pills de seleção de papel */}
        <div
          role="tablist"
          aria-label="Selecionar perfil de acesso"
          className="rbac-reveal mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {ROLES.map((role) => {
            const active = role.key === selectedRole;
            return (
              <button
                key={role.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedRole(role.key)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  active
                    ? "bg-primary text-white shadow-glow"
                    : "bg-white text-slate-500 ring-1 ring-slate-200/70 hover:text-ink hover:ring-slate-300",
                ].join(" ")}
              >
                <Icon
                  name={
                    role.key === "admin"
                      ? "ShieldCheck"
                      : role.key === "profissional"
                        ? "Stethoscope"
                        : "CalendarDays"
                  }
                  className="h-4 w-4"
                />
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Layout em duas colunas */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ESQUERDA — mockup do sistema */}
          <div className="rbac-reveal">
            <BrowserFrame>
              <div className="flex gap-3 sm:gap-4">
                <AppSidebar
                  activeId="dashboard"
                  className="shrink-0 self-stretch"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <AppHeader title="Visão por perfil" />

                  {/* Área de preview do conteúdo — reforça a leitura de "app real" */}
                  <div className="flex flex-1 flex-col gap-3 rounded-[22px] bg-white p-4 ring-1 ring-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink">
                        Módulos disponíveis
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          backgroundColor: COLORS.tealSoft,
                          color: STATUS_META.confirmado.text,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.teal }}
                        />
                        {allowed.length} de {NAV_ITEMS.length}
                      </span>
                    </div>

                    {/* Skeleton de cards decorativo — espelha a "tela" do módulo */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {NAV_ITEMS.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-canvas p-3 ring-1 ring-slate-200/60"
                        >
                          <Icon
                            name={item.icon}
                            className="h-4 w-4 text-slate-400"
                          />
                          <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-200" />
                          <div className="mt-1.5 h-4 w-1/2 rounded-full bg-slate-300/80" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-1 space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-slate-100" />
                      <div className="h-2.5 w-5/6 rounded-full bg-slate-100" />
                      <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>

          {/* DIREITA — descrição do papel + matriz de módulos */}
          <div className="rbac-reveal flex flex-col gap-5">
            {/* Cartão de descrição do papel ativo */}
            <div className="ds-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-glow">
                  <Icon name="UserCog" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Perfil selecionado
                  </p>
                  <h3 className="text-xl font-extrabold tracking-tight text-ink">
                    {activeRole.label}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {activeRole.description}
              </p>
            </div>

            {/* Lista dos 6 módulos com check (permitido) / cadeado (negado) */}
            <ul className="ds-card divide-y divide-slate-100 p-2 sm:p-3">
              {NAV_ITEMS.map((item) => {
                const isAllowed = allowed.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-3 sm:px-4"
                  >
                    <span
                      className={[
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                        isAllowed
                          ? "bg-teal-soft"
                          : "bg-slate-100",
                      ].join(" ")}
                    >
                      <Icon
                        name={item.icon}
                        className="h-[18px] w-[18px]"
                        style={{
                          color: isAllowed ? COLORS.teal : COLORS.muted,
                        }}
                      />
                    </span>

                    <span
                      className={[
                        "flex-1 text-sm font-semibold transition-colors duration-300",
                        isAllowed ? "text-ink" : "text-slate-400",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>

                    {isAllowed ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal">
                        <Icon name="Check" className="h-4 w-4" />
                        <span className="hidden sm:inline">Liberado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Icon name="Lock" className="h-4 w-4" />
                        <span className="hidden sm:inline">Restrito</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
