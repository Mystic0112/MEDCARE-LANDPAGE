import { ACTIVITY_BARS, COLORS } from "@/lib/constants";

const VIEW_W = 560;
const VIEW_H = 240;
const PLOT_TOP = 24;
const BASELINE = 196; // y do eixo X
const PLOT_H = BASELINE - PLOT_TOP;
const BAR_W = 40;

/**
 * Gráfico de Atividade em SVG customizado (barras azuis).
 * Cada barra tem a classe `.chart-bar` e transform-origin na base, para
 * que a Hero anime o preenchimento (scaleY 0 → 1) no Passo 4 da montagem.
 *
 * Renderiza em altura cheia por padrão; o `gsap.set` da Hero define o
 * estado inicial (scaleY:0) antes do paint, evitando qualquer "flash".
 */
export function ActivityChart({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const slot = VIEW_W / ACTIVITY_BARS.length;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div
      className={[
        "rounded-panel bg-white p-4 ring-1 ring-slate-200/70 sm:p-5",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-ink">Atividade da Semana</p>
          <p className="text-[11px] text-slate-400">Consultas realizadas por dia</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {["Semanal", "Mensal", "Anual"].map((p, i) => (
            <span
              key={p}
              className={[
                "ds-pill",
                i === 0 ? "bg-white text-ink shadow-soft" : "text-slate-400",
              ].join(" ")}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-[180px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de atividade semanal"
      >
        {/* Grid tracejado */}
        {gridLines.map((g) => {
          const y = BASELINE - g * PLOT_H;
          return (
            <line
              key={g}
              x1={0}
              x2={VIEW_W}
              y1={y}
              y2={y}
              stroke={COLORS.muted}
              strokeWidth={1}
              strokeDasharray="4 6"
              opacity={0.35}
            />
          );
        })}

        {/* Barras */}
        {ACTIVITY_BARS.map((bar, i) => {
          const h = bar.value * PLOT_H;
          const x = i * slot + (slot - BAR_W) / 2;
          const y = BASELINE - h;
          return (
            <g key={bar.label}>
              <rect
                className="chart-bar"
                x={x}
                y={y}
                width={BAR_W}
                height={h}
                rx={10}
                fill={COLORS.primary}
                style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              />
              <text
                x={x + BAR_W / 2}
                y={BASELINE + 28}
                textAnchor="middle"
                fontSize={16}
                fill={COLORS.muted}
                fontWeight={600}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
