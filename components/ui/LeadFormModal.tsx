"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * LeadFormModal — captação de leads ("Solicitar acesso").
 * CONTRATO: abre via window.dispatchEvent(new CustomEvent("medcare:lead")).
 * A11y: role="dialog" + aria-modal, focus trap, foco no primeiro input ao
 * abrir e devolvido ao gatilho ao fechar, Escape fecha, scroll travado.
 * Entrada animada só com transição CSS (opacity/scale) — sem GSAP.
 */

type Errors = { name?: string; email?: string; org?: string };

/** Campos obrigatórios do formulário — renderizados por map. */
type Field = {
  id: string;
  name: keyof Errors;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: string;
};
// prettier-ignore
const FIELDS: Field[] = [
  { id: "lead-name", name: "name", label: "Nome", placeholder: "Seu nome completo", autoComplete: "name" },
  { id: "lead-email", name: "email", label: "E-mail", type: "email", placeholder: "voce@clinica.org", autoComplete: "email" },
  { id: "lead-org", name: "org", label: "Instituição / Clínica", placeholder: "Nome da instituição", autoComplete: "organization" },
];

/** Opções do select "Perfil" — espelham os perfis reais de acesso (RBAC). */
const ROLES = ["Administrador", "Profissional", "Secretário", "Outro"];

const INPUT_CLS =
  "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-foreground " +
  "placeholder:text-foreground/40 outline-none transition-colors " +
  "focus-visible:ring-2 focus-visible:ring-foreground/25 focus-visible:border-foreground/50";

const LABEL_CLS =
  "mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/60";

export function LeadFormModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // dispara a transição CSS de entrada
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  // Só fecha pelo overlay se o gesto COMEÇOU nele — seleção de texto que
  // termina no backdrop não pode descartar o formulário preenchido.
  const pressOnOverlay = useRef(false);

  // Abre ao receber o CustomEvent — guarda quem disparou p/ devolver o foco.
  useEffect(() => {
    const onOpen = () => {
      openerRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("medcare:lead", onOpen);
    return () => window.removeEventListener("medcare:lead", onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setShown(false);
    setSent(false);
    setErrors({});
    openerRef.current?.focus();
  }, []);

  // Enquanto aberto: trava o scroll, Escape fecha, Tab circula (focus trap).
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // 2 frames para a transição CSS partir do estado inicial (opacity/scale).
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setShown(true)),
    );

    panelRef.current?.querySelector<HTMLElement>("input")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      // defaultPrevented: Escape que fechou o dropdown nativo do <select>
      // não deve fechar o modal junto.
      if (e.key === "Escape" && !e.defaultPrevented) return close();
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "button, input, select, a[href]",
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      // Foco escapou do painel (ex.: clique em área não interativa) —
      // recaptura em vez de deixar o Tab vazar para a página atrás.
      if (!panelRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open, close]);

  // No sucesso os inputs desmontam — realoca o foco para dentro do modal.
  useEffect(() => {
    if (sent) panelRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [sent]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const email = value("email");

    const next: Errors = {};
    if (!value("name")) next.name = "Informe seu nome.";
    if (!email) next.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Formato de e-mail inválido.";
    if (!value("org")) next.org = "Informe sua instituição ou clínica.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: enviar para endpoint/planilha quando definido.
    setSent(true);
  };

  if (!open) return null;

  return (
    <div
      onPointerDown={(e) => {
        pressOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressOnOverlay.current) close();
      }}
      data-lenis-prevent
      className={[
        "fixed inset-0 z-[100] grid place-items-center overflow-y-auto",
        "bg-background/80 px-5 py-8 backdrop-blur transition-opacity duration-200",
        shown ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        className={[
          "ds-card w-full max-w-md rounded-2xl bg-background p-8 sm:p-10",
          "transition-all duration-200",
          shown ? "scale-100 opacity-100" : "scale-95 opacity-0",
        ].join(" ")}
      >
        {/* Header — kicker mono + título + fechar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ds-kicker">[ Acesso Beta ]</span>
            <h2
              id="lead-modal-title"
              className="mt-3 font-sans text-2xl font-bold uppercase leading-none tracking-tight text-foreground"
            >
              Solicitar acesso
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Icon name="X" className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          /* ---------- Estado de sucesso ---------- */
          <div className="mt-8">
            <Icon name="CircleCheck" className="h-10 w-10 text-teal" />
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Recebemos seu interesse. Nossa equipe entrará em contato pelo
              e-mail informado.
            </p>
            <button
              type="button"
              onClick={close}
              className="ds-btn-ghost mt-8 w-full"
            >
              Fechar
            </button>
          </div>
        ) : (
          /* ---------- Formulário ---------- */
          <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
            {FIELDS.map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className={LABEL_CLS}>
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type ?? "text"}
                  required
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  aria-invalid={errors[f.name] ? true : undefined}
                  aria-describedby={errors[f.name] ? `${f.id}-erro` : undefined}
                  className={`${INPUT_CLS} ${errors[f.name] ? "border-destructive" : "border-foreground/20"}`}
                />
                {errors[f.name] && (
                  <p id={`${f.id}-erro`} className="mt-1.5 text-xs text-destructive">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="lead-role" className={LABEL_CLS}>
                Perfil (opcional)
              </label>
              <select
                id="lead-role"
                name="role"
                defaultValue=""
                className={`${INPUT_CLS} appearance-none border-foreground/20`}
              >
                <option value="">Selecionar…</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="ds-btn-primary mt-2 w-full">
              Enviar solicitação
              <Icon name="ArrowRight" className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
