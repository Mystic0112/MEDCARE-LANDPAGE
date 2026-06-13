import { STATUS_META, type StatusKey } from "@/lib/constants";

/**
 * Badge de status — monocromático com um único ponto de cor (o dot).
 * O texto é neutro/hairline; a cor do status aparece só no ponto de luz,
 * reforçando a transição sutil aguardando → confirmado.
 */
export function StatusBadge({
  status,
  className = "",
  ...rest
}: { status: StatusKey; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  const meta = STATUS_META[status];
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-transparent px-3 py-1",
        "font-mono text-[11px] uppercase tracking-wider text-foreground/70",
        className,
      ].join(" ")}
      {...rest}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </span>
  );
}
