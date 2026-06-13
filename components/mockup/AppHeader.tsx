import { Icon } from "@/components/ui/Icon";
import { AVATAR } from "@/lib/constants";

/**
 * Header superior do sistema: barra de busca arredondada, sino de
 * notificações com badge vermelho e avatar do usuário.
 * `...rest` é repassado para hooks de animação da Hero (data-assembly="header").
 */
export function AppHeader({
  className = "",
  title = "Dashboard",
  ...rest
}: { title?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={[
        "flex items-center gap-3 rounded-[22px] bg-white px-3 py-2.5 ring-1 ring-slate-200/70 sm:px-4",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="truncate text-sm font-bold text-ink">{title}</span>
        <span className="truncate text-[11px] text-slate-400">
          12 de junho de 2026
        </span>
      </div>

      {/* Barra de busca (rounded-full) */}
      <div className="ml-auto flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 text-slate-400">
        <Icon name="Search" className="h-4 w-4" />
        <span className="hidden text-xs sm:inline">Buscar paciente, profissional…</span>
      </div>

      {/* Notificações */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Notificações"
        className="relative grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500"
      >
        <Icon name="Bell" className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-white" />
      </button>

      {/* Avatar */}
      <div className="h-9 w-9 overflow-hidden rounded-full bg-primary-soft ring-1 ring-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR("Dra Helena")}
          alt="Avatar do usuário"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </header>
  );
}
