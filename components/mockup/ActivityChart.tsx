import { ACTIVITY_BARS, COLORS } from "@/lib/constants";

const VIEW_W = 560;
const VIEW_H = 240;
const PLOT_TOP = 24;
const BASELINE = 196; // y do eixo X
const PLOT_H = BASELINE - PLOT_TOP;
const PAD_X = 24;
const STEP = (VIEW_W - 2 * PAD_X) / (ACTIVITY_BARS.length - 1);

// Pontos da série (x ao longo da semana, y proporcional ao valor 0–1).
const POINTS = ACTIVITY_BARS.map((bar, i) => ({
  label: bar.label,
  x: PAD_X + i * STEP,
  y: BASELINE - bar.value * PLOT_H,
}));

const LINE_PATH = POINTS.map(
  (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
).join(" ");

const AREA_PATH =
  `M ${POINTS[0].x.toFixed(1)} ${BASELINE} ` +
  POINTS.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
  ` L ${POINTS[POINTS.length - 1].x.toFixed(1)} ${BASELINE} Z`;

/**
 * Gráfico de Atividade — uma LINHA fina que se desenha no scroll.
 *
 * O traço (`.chart-line`) usa pathLength=1 + dasharray=1; a Hero (e o fallback
 * mobile) animam `strokeDashoffset` de 1 → 0 para "desenhar" a linha. A cor de
 * acento (azul da marca) é o único ponto de luz; grade e rótulos são mono.
 * Renderiza desenhado por padrão — o `gsap.set` define o estado inicial
 * (offset:1, área invisível) antes do paint, evitando flash.
 */
export function ActivityChart({
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div
      className={[
        "rounded-2xl border border-foreground/10 bg-transparent p-4 sm:p-5",
        className,
      ].join(" ")}
      {...rest}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">
            Atividade da Semana
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
            Consultas por dia
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {["Semanal", "Mensal", "Anual"].map((p, i) => (
            <span
              key={p}
              className={[
                "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
                i === 0
                  ? "bg-foreground text-background"
                  : "border border-foreground/10 text-foreground/40",
              ].join(" ")}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-[180px] w-full text-foreground"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de atividade semanal"
      >
        {/* Grade mono */}
        {gridLines.map((g) => {
          const y = BASELINE - g * PLOT_H;
          return (
            <line
              key={g}
              x1={0}
              x2={VIEW_W}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.08}
            />
          );
        })}

        {/* Área de acento (sutil) — fade-in controlado pela Hero */}
        <path
          className="chart-area"
          d={AREA_PATH}
          fill={COLORS.primary}
          fillOpacity={0.08}
          stroke="none"
        />

        {/* A linha que se desenha no scroll — ponto de luz */}
        <path
          className="chart-line"
          d={LINE_PATH}
          fill="none"
          stroke={COLORS.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
        />

        {/* Nós da série */}
        {POINTS.map((p) => (
          <circle
            key={p.label}
            className="chart-dot"
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill={COLORS.primary}
          />
        ))}

        {/* Rótulos mono */}
        {POINTS.map((p) => (
          <text
            key={`l-${p.label}`}
            className="font-mono"
            x={p.x}
            y={BASELINE + 28}
            textAnchor="middle"
            fontSize={13}
            fill="currentColor"
            opacity={0.4}
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
