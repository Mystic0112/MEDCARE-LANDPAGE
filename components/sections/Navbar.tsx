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
 * Barra superior fixa — monocromática.
 *
 * - Transparente no topo; ganha vidro fosco + hairline após ~40px de scroll.
 * - Toggle de tema (alterna `.dark` no <html>, persiste em localStorage).
 * - Menu mobile (hamburger) com dropdown que fecha ao clicar num link.
 * - Links em monoespaçada uppercase (assinatura editorial).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Background ciente do scroll — listener passivo, removido na limpeza.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
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
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* localStorage indisponível (modo privado) — ignora */
    }
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-foreground/10 bg-background/80 backdrop-blur"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
      >
        {/* Esquerda: logo chip + wordmark */}
        <a
          href="#inicio"
          className="flex items-center gap-2.5"
          aria-label="MedCare — início"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
            <Icon name="HeartPulse" className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            MedCare
          </span>
        </a>

        {/* Centro: links âncora (escondidos no mobile) */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/60 transition-colors hover:text-foreground"
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
            className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
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
            className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:text-foreground md:hidden"
          >
            <Icon name={menuOpen ? "X" : "Menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Painel dropdown mobile — fecha ao clicar num link */}
      <div
        className={[
          "overflow-hidden border-t border-foreground/10 bg-background/95 backdrop-blur transition-[max-height,opacity] duration-300 md:hidden",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-mono text-xs uppercase tracking-wider text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
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
