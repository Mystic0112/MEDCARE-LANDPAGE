import { icons, type LucideProps } from "lucide-react";

/**
 * Renderiza um ícone Lucide a partir do seu nome (string PascalCase).
 * Permite guardar nomes de ícones em dados/constantes.
 *
 *   <Icon name="HeartPulse" className="h-5 w-5" />
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
}
