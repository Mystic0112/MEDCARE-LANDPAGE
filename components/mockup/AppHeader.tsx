import { Icon } from "@/components/ui/Icon";
import { AVATAR, COLORS } from "@/lib/constants";

/**
 * Header superior do sistema (monocromático): título, busca em hairline, sino
 * com um único ponto de luz (badge em acento) e avatar. `...rest` é repassado
 * para hooks de animação da Hero.
 */
export function AppHeader({
  className = "",
  title = "Dashboard",
  ...rest
}: { title?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={[
        "flex items-center gap-3 rounded-2xl border border-foreground/10 bg-transparent px-3 py-2.5 sm:px-4",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="truncate text-sm font-bold text-foreground">
          {title}
        </span>
        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-foreground/40">
          12 · 06 · 2026
        </span>
      </div>

      {/* Busca */}
      <div className="ml-auto flex items-center gap-2 rounded-full border border-foreground/10 px-3.5 py-2 text-foreground/40">
        <Icon name="Search" className="h-4 w-4" />
        <span className="hidden font-mono text-[11px] uppercase tracking-wider sm:inline">
          Buscar…
        </span>
      </div>

      {/* Notificações — único ponto de cor (acento) */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Notificações"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-foreground/10 text-foreground/60"
      >
        <Icon name="Bell" className="h-4 w-4" />
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-background"
          style={{ backgroundColor: COLORS.primary }}
        />
      </button>

      {/* Avatar */}
      <div className="h-9 w-9 overflow-hidden rounded-full border border-foreground/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR("Dra Helena")}
          alt="Avatar do usuário"
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
        />
      </div>
    </header>
  );
}
