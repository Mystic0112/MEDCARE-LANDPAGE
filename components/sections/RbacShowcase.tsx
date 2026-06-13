"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AppHeader } from "@/components/mockup/AppHeader";
import { AppSidebar } from "@/components/mockup/AppSidebar";
import { BrowserFrame } from "@/components/mockup/BrowserFrame";
import { COLORS, NAV_ITEMS, ROLES, type RoleKey } from "@/lib/constants";

/**
 * Seção "Controle de Acesso" [04].
 *
 * Demonstra o RBAC: o visitante alterna entre Administrador, Profissional e
 * Secretário e vê quais módulos cada perfil enxerga. À esquerda, o mockup
 * monocromático (a sidebar acende/apaga itens via GSAP). À direita, a matriz
 * de módulos com check (teal — ponto de luz) ou cadeado (neutro).
 *
 * A animação de visibilidade roda em `useGSAP` com `dependencies:[selectedRole]`,
 * então o contexto reverte e re-executa limpo a cada troca (sem leaks).
 */
export function RbacShowcase() {
  const root = useRef<HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey>("admin");

  const activeRole = ROLES.find((r) => r.key === selectedRole) ?? ROLES[0];
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
            gsap.to(target, { ...vars, duration: 0.4, ease: "power2.out" });
          } else {
            gsap.set(target, vars);
          }
        });
      };

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

      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
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
      });
    },
    { scope: root, dependencies: [selectedRole] },
  );

  return (
    <section id="acesso" ref={root} className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          kicker="Controle de Acesso"
          kickerIcon="ShieldCheck"
          direction="right"
          title={
            <>
              Cada perfil vê o <span className="text-primary">essencial</span>
            </>
          }
          subtitle="Permissões granulares por papel (RBAC): o sistema revela apenas os módulos relevantes para cada pessoa — menos ruído, mais segurança, zero acesso indevido."
        />

        {/* Pills de seleção de papel */}
        <div
          role="tablist"
          aria-label="Selecionar perfil de acesso"
          className="rbac-reveal mt-12 flex flex-wrap items-center gap-2.5"
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
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300",
                  active
                    ? "bg-foreground text-background"
                    : "border border-foreground/15 text-foreground/60 hover:text-foreground",
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

                  <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-foreground/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                        Módulos disponíveis
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: COLORS.teal }}
                        />
                        {allowed.length} / {NAV_ITEMS.length}
                      </span>
                    </div>

                    {/* Skeleton de cards decorativo */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {NAV_ITEMS.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-foreground/10 p-3"
                        >
                          <Icon
                            name={item.icon}
                            className="h-4 w-4 text-foreground/40"
                          />
                          <div className="mt-2 h-2 w-3/4 rounded-full bg-foreground/10" />
                          <div className="mt-1.5 h-4 w-1/2 rounded-full bg-foreground/20" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-1 space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-foreground/5" />
                      <div className="h-2.5 w-5/6 rounded-full bg-foreground/5" />
                      <div className="h-2.5 w-2/3 rounded-full bg-foreground/5" />
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>

          {/* DIREITA — descrição do papel + matriz de módulos */}
          <div className="rbac-reveal flex flex-col gap-5">
            <div className="ds-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-foreground text-background">
                  <Icon name="UserCog" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: COLORS.primary }}
                  >
                    Perfil selecionado
                  </p>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {activeRole.label}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                {activeRole.description}
              </p>
            </div>

            {/* Lista dos 6 módulos */}
            <ul className="ds-card divide-y divide-foreground/10 p-2 sm:p-3">
              {NAV_ITEMS.map((item) => {
                const isAllowed = allowed.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-3 sm:px-4"
                  >
                    <span
                      className={[
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                        isAllowed ? "bg-teal/15" : "border border-foreground/10",
                      ].join(" ")}
                    >
                      <Icon
                        name={item.icon}
                        className={[
                          "h-[18px] w-[18px]",
                          isAllowed ? "" : "text-foreground/30",
                        ].join(" ")}
                        style={isAllowed ? { color: COLORS.teal } : undefined}
                      />
                    </span>

                    <span
                      className={[
                        "flex-1 text-sm font-semibold transition-colors duration-300",
                        isAllowed ? "text-foreground" : "text-foreground/40",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>

                    {isAllowed ? (
                      <span
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: COLORS.teal }}
                      >
                        <Icon name="Check" className="h-4 w-4" />
                        <span className="hidden sm:inline">Liberado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
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
