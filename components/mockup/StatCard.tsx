import { Icon } from "@/components/ui/Icon";

type Accent = "primary" | "teal" | "purple";

const ACCENT: Record<Accent, { bg: string; chip: string; color: string }> = {
  primary: { bg: "bg-primary-soft", chip: "bg-primary/15", color: "#4578FF" },
  teal: { bg: "bg-teal-soft", chip: "bg-teal/15", color: "#00C2C7" },
  purple: { bg: "bg-purple-soft", chip: "bg-purple/15", color: "#A033FF" },
};

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number | string;
  sub?: string;
  icon: string;
  accent?: Accent;
}

/**
 * Stat Card do Dashboard. `...rest` é repassado para que a Hero possa
 * anexar hooks de animação (ex.: data-assembly="stat").
 */
export function StatCard({
  title,
  value,
  sub,
  icon,
  accent = "primary",
  className = "",
  ...rest
}: StatCardProps) {
  const a = ACCENT[accent];
  const display =
    typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[28px] p-4 sm:p-5",
        a.bg,
        "ring-1 ring-black/[0.03]",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Ícone decorativo de fundo (opacidade ~12%) */}
      <Icon
        name={icon}
        className="pointer-events-none absolute -bottom-4 -right-3 h-24 w-24"
        style={{ color: a.color, opacity: 0.12 }}
      />

      <div className="relative flex items-center gap-2">
        <span
          className={["grid h-8 w-8 place-items-center rounded-xl", a.chip].join(
            " ",
          )}
        >
          <Icon name={icon} className="h-4 w-4" style={{ color: a.color }} />
        </span>
        <p className="text-xs font-semibold text-slate-600">{title}</p>
      </div>

      <p className="relative mt-3 text-[34px] font-extrabold leading-none tracking-tight text-ink">
        {display}
      </p>
      {sub && <p className="relative mt-1.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
