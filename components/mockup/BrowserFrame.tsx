/**
 * "Carcaça" do navegador — o mockup que aparece na Hero e no RBAC.
 *
 * Aplica `.invert-theme`: o produto adota o tema OPOSTO ao da landing (preto na
 * página clara, branco na página escura) — um bloco de alto contraste de grife.
 * Por isso o interior usa só tokens (bg-background, border-foreground…), nunca
 * variantes `dark:`: quem inverte são as CSS vars do contexto.
 */
export function BrowserFrame({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "invert-theme overflow-hidden rounded-2xl border border-foreground/10 bg-background",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* Barra de título */}
      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <div className="ml-3 hidden items-center gap-2 rounded-full border border-foreground/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/40 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
          app.medcare.health
        </div>
      </div>

      {/* Tela do sistema */}
      <div className="bg-background p-3 sm:p-4">{children}</div>
    </div>
  );
}
