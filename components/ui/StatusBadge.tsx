import { STATUS_META, type StatusKey } from "@/lib/constants";

/**
 * Badge de status de agendamento (aguardando · confirmado · concluída · cancelado).
 * As cores vêm de STATUS_META para refletirem exatamente o sistema.
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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        className,
      ].join(" ")}
      style={{ backgroundColor: meta.bg, color: meta.text }}
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
