/**
 * "Carcaça" do navegador/monitor — o mockup vazio que aparece na Hero
 * antes da montagem do sistema. O fundo interno é limpo (branco/escuro,
 * adaptando-se ao tema) e recebe os componentes do MedCare via children.
 */
export function BrowserFrame({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[28px] bg-white shadow-float ring-1 ring-slate-200/70",
        "dark:bg-[#0B1120] dark:ring-white/10",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Barra de título do navegador */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/5 dark:bg-white/5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <div className="ml-3 hidden items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] text-slate-400 ring-1 ring-slate-200/70 sm:flex dark:bg-white/5 dark:text-slate-500 dark:ring-white/10">
          <span className="h-2.5 w-2.5 rounded-full border border-slate-300" />
          app.medcare.health
        </div>
      </div>

      {/* Tela do sistema (canvas limpo do MedCare) */}
      <div className="bg-canvas p-3 dark:bg-[#0B1120] sm:p-4">{children}</div>
    </div>
  );
}
