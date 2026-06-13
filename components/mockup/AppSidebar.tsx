import { Icon } from "@/components/ui/Icon";
import { NAV_ITEMS } from "@/lib/constants";

interface AppSidebarProps extends React.HTMLAttributes<HTMLElement> {
  activeId?: string;
  /** Cada item recebe data-nav={id} para que o RBAC anime visibilidade. */
}

/**
 * Sidebar vertical de 90px do sistema MedCare.
 * Logo HeartPulse no topo, ícones de navegação, toggle de tema na base.
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
        "flex h-full w-[72px] flex-col items-center justify-between rounded-[26px]",
        "bg-white py-4 ring-1 ring-slate-200/70 sm:w-[90px]",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* Logo */}
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-glow">
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
                "grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-300",
                active
                  ? "bg-primary text-white shadow-glow"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
              ].join(" ")}
            >
              <Icon name={item.icon} className="h-[18px] w-[18px]" />
            </button>
          );
        })}
      </div>

      {/* Toggle de tema (decorativo no mockup) */}
      <div className="grid h-11 w-11 place-items-center rounded-2xl text-slate-400">
        <Icon name="MoonStar" className="h-[18px] w-[18px]" />
      </div>
    </aside>
  );
}
