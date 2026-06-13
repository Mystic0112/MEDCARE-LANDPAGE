"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Links de navegação âncora — apontam para os ids reais das seções. */
const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#recursos", label: "Recursos" },
  { href: "#agendamento", label: "Agendamento" },
  { href: "#prontuario", label: "Prontuário" },
  { href: "#acesso", label: "Acessos" },
  { href: "#seguranca", label: "Segurança" },
];

/**
 * Barra superior fixa da landing page.
 *
 * - Fundo transparente no topo; ganha vidro fosco + sombra + hairline após ~40px de scroll
 *   (listener de scroll passivo com cleanup, sem GSAP).
 * - Toggle de tema que alterna a classe `dark` no <html>.
 * - Menu mobile (hamburger) com painel dropdown que fecha ao clicar num link.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Background ciente do scroll — listener passivo, removido na limpeza (sem leak).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // estado inicial correto após hidratação / reload em meio à página
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sincroniza o estado inicial do tema com a classe já presente no <html>.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.classList.toggle("dark");
    setIsDark(next);
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-slate-200/60 bg-white/80 shadow-soft backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
      >
        {/* Esquerda: logo chip + wordmark + tag CESBEN */}
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="MedCare — início">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white shadow-glow">
            <Icon name="HeartPulse" className="h-5 w-5" />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-ink dark:text-white">
              MedCare
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              CESBEN
            </span>
          </span>
        </a>

        {/* Centro: links âncora (escondidos no mobile) */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Direita: toggle de tema + CTA + hamburger (mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            aria-pressed={isDark}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 ring-1 ring-slate-200/60 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5"
          >
            <Icon name={isDark ? "Sun" : "Moon"} className="h-5 w-5" />
          </button>

          <a href="#acesso" className="ds-btn-primary hidden sm:inline-flex">
            Acessar sistema
          </a>

          {/* Hamburger — só no mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 ring-1 ring-slate-200/60 transition-colors hover:bg-slate-100 hover:text-primary md:hidden dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5"
          >
            <Icon name={menuOpen ? "X" : "Menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Painel dropdown mobile — fecha ao clicar num link */}
      <div
        className={[
          "overflow-hidden border-t border-slate-200/60 bg-white/95 backdrop-blur transition-[max-height,opacity] duration-300 md:hidden dark:border-white/10 dark:bg-slate-900/95",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary dark:text-slate-200 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#acesso"
            onClick={() => setMenuOpen(false)}
            className="ds-btn-primary mt-2 w-full"
          >
            Acessar sistema
          </a>
        </div>
      </div>
    </header>
  );
}
