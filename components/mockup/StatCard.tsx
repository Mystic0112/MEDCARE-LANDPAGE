import { Icon } from "@/components/ui/Icon";

type Accent = "primary" | "teal" | "purple";

/** Acento focal por card — usado SÓ na hairline superior e no valor de tendência. */
const ACCENT: Record<Accent, string> = {
  primary: "#4578FF",
  teal: "#00C2C7",
  purple: "#A033FF",
};

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number | string;
  sub?: string;
  icon: string;
  accent?: Accent;
}

/**
 * Stat Card do Dashboard — monocromático. Sem fundo colorido: hairline 1px,
 * número grande em mono, e a cor da marca aparece só como ponto de luz (a
 * linha fina no topo + a tendência). `...rest` repassa hooks de animação.
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
  const color = ACCENT[accent];
  const display =
    typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-foreground/10 bg-transparent p-4 sm:p-5",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Linha fina de acento no topo — ponto de luz */}
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: color }}
      />

      {/* Marca d'água sutil do ícone */}
      <Icon
        name={icon}
        className="pointer-events-none absolute -bottom-3 -right-2 h-20 w-20 text-foreground"
        style={{ opacity: 0.04 }}
      />

      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">
          {title}
        </p>
        <Icon name={icon} className="h-4 w-4 text-foreground/70" />
      </div>

      <p className="relative mt-4 font-mono text-[34px] font-bold leading-none tracking-tight text-foreground">
        {display}
      </p>
      {sub && (
        <p
          className="relative mt-2 font-mono text-[11px] tracking-wide"
          style={{ color }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
