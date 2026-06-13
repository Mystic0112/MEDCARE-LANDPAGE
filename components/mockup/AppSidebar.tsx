import { Icon } from "@/components/ui/Icon";
import { NAV_ITEMS } from "@/lib/constants";

interface AppSidebarProps extends React.HTMLAttributes<HTMLElement> {
  activeId?: string;
  /** Cada item recebe data-nav={id} para que o RBAC anime visibilidade. */
}

/**
 * Sidebar vertical de 90px do sistema MedCare — versão monocromática.
 * Item ativo = bloco invertido (foreground/background). Logo idem.
 * Reutilizada na Hero (montagem) e na seção RBAC (visibilidade por papel).
 */
export function AppSidebar({
  activeId = "dashboard",
  className = "",
  ...rest
}: AppSidebarProps) {
  return (
    <aside
      className={[
        "flex h-full w-[72px] flex-col items-center justify-between rounded-2xl",
        "border border-foreground/10 bg-transparent py-4 sm:w-[90px]",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* Logo */}
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
          <Icon name="HeartPulse" className="h-5 w-5" />
        </div>

        {NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              data-nav={item.id}
              aria-label={item.label}
              tabIndex={-1}
              className={[
                "grid h-11 w-11 place-items-center rounded-xl transition-colors duration-300",
                active
                  ? "bg-foreground text-background"
                  : "text-foreground/35 hover:bg-foreground/5 hover:text-foreground/70",
              ].join(" ")}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
            </button>
          );
        })}
      </div>

      {/* Toggle de tema (decorativo no mockup) */}
      <div className="grid h-11 w-11 place-items-center rounded-xl text-foreground/35">
        <Icon name="MoonStar" className="h-[18px] w-[18px]" />
      </div>
    </aside>
  );
}
