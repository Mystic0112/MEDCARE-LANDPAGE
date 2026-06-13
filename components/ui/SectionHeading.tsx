import { Icon } from "./Icon";

interface SectionHeadingProps {
  kicker?: string;
  kickerIcon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}

/**
 * Cabeçalho padrão de seção: eyebrow (kicker) + título + subtítulo.
 * `light` adapta as cores para fundos escuros.
 */
export function SectionHeading({
  kicker,
  kickerIcon,
  title,
  subtitle,
  align = "center",
  light = false,
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div
      className={[
        "max-w-2xl",
        isCenter ? "mx-auto text-center items-center" : "text-left items-start",
        "flex flex-col",
        className,
      ].join(" ")}
    >
      {kicker && (
        <span
          className={[
            "ds-kicker",
            light ? "bg-white/10 text-white/80 ring-white/15" : "",
          ].join(" ")}
        >
          {kickerIcon && <Icon name={kickerIcon} className="h-3.5 w-3.5" />}
          {kicker}
        </span>
      )}
      <h2
        className={[
          "mt-5 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl",
          light ? "text-white" : "text-ink",
        ].join(" ")}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={[
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-white/60" : "text-slate-500",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
