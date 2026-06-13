/**
 * Tokens, dados de exemplo e matrizes de configuração compartilhados
 * por todas as seções da landing page.
 *
 * Os valores HEX são repetidos aqui (além do tailwind.config) porque
 * SVGs e estilos inline do GSAP não enxergam classes do Tailwind.
 */

export const COLORS = {
  primary: "#4578FF",
  primarySoft: "#E8F0FF",
  teal: "#00C2C7",
  tealSoft: "#E0F8FC",
  purple: "#A033FF",
  purpleSoft: "#F5E8FF",
  amber: "#FF9E00",
  amberSoft: "#FFECCC",
  destructive: "#EF4444",
  canvas: "#F8FAFC",
  card: "#FFFFFF",
  muted: "#94A3B8",
  ink: "#0F172A",
} as const;

export type RoleKey = "admin" | "profissional" | "secretario";

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  description: string;
  /** Itens da sidebar visíveis para este papel (ver NAV_ITEMS.id) */
  allowed: string[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string; // nome do ícone Lucide
}

/** Itens da Sidebar de 90px do sistema (na ordem real do produto). */
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "pacientes", label: "Pacientes", icon: "Users" },
  { id: "profissionais", label: "Profissionais", icon: "UserCheck" },
  { id: "agendamentos", label: "Agendamentos", icon: "CalendarDays" },
  { id: "prontuarios", label: "Prontuários", icon: "ClipboardList" },
  { id: "medicamentos", label: "Medicamentos", icon: "Pill" },
];

/**
 * Matriz RBAC — espelha a tabela de Controle de Acesso do sistema.
 *  admin        → todos os módulos
 *  profissional → Dashboard, Pacientes, Prontuários, Medicamentos
 *  secretario   → Dashboard, Pacientes, Profissionais, Agendamentos
 */
export const ROLES: RoleDefinition[] = [
  {
    key: "admin",
    label: "Administrador",
    description:
      "Controle operacional completo. Enxerga e gerencia todos os módulos da clínica.",
    allowed: [
      "dashboard",
      "pacientes",
      "profissionais",
      "agendamentos",
      "prontuarios",
      "medicamentos",
    ],
  },
  {
    key: "profissional",
    label: "Profissional",
    description:
      "Foco no atendimento clínico: prontuários, evolução e medicamentos dos seus pacientes.",
    allowed: ["dashboard", "pacientes", "prontuarios", "medicamentos"],
  },
  {
    key: "secretario",
    label: "Secretário",
    description:
      "Recepção e agenda: cadastra pacientes, gerencia profissionais e organiza os agendamentos.",
    allowed: ["dashboard", "pacientes", "profissionais", "agendamentos"],
  },
];

/** Stat cards do Dashboard (montados na Hero). */
export const STAT_CARDS = [
  {
    id: "pacientes",
    title: "Total de Pacientes",
    value: 1248,
    sub: "+86 neste mês",
    icon: "Users",
    accent: "primary" as const,
  },
  {
    id: "profissionais",
    title: "Profissionais",
    value: 37,
    sub: "Voluntários ativos",
    icon: "UserCheck",
    accent: "teal" as const,
  },
  {
    id: "consultas",
    title: "Consultas Hoje",
    value: 24,
    sub: "8 confirmadas",
    icon: "CalendarDays",
    accent: "purple" as const,
  },
];

/** Alturas relativas (0–1) das barras do gráfico de atividade semanal. */
export const ACTIVITY_BARS = [
  { label: "Seg", value: 0.52 },
  { label: "Ter", value: 0.74 },
  { label: "Qua", value: 0.43 },
  { label: "Qui", value: 0.88 },
  { label: "Sex", value: 0.66 },
  { label: "Sáb", value: 0.31 },
  { label: "Dom", value: 0.18 },
];

export type StatusKey = "aguardando" | "confirmado" | "concluida" | "cancelado";

export const STATUS_META: Record<
  StatusKey,
  { label: string; dot: string; text: string; bg: string }
> = {
  aguardando: {
    label: "Aguardando",
    dot: "#FF9E00",
    text: "#B45309",
    bg: "#FFECCC",
  },
  confirmado: {
    label: "Confirmado",
    dot: "#00C2C7",
    text: "#0E7490",
    bg: "#E0F8FC",
  },
  concluida: {
    label: "Concluída",
    dot: "#22C55E",
    text: "#15803D",
    bg: "#DCFCE7",
  },
  cancelado: {
    label: "Cancelado",
    dot: "#EF4444",
    text: "#B91C1C",
    bg: "#FEE2E2",
  },
};

/** Diferenciais de segurança (seção minimalista). */
export const SECURITY_FEATURES = [
  {
    icon: "ShieldCheck",
    title: "Proteção CSRF",
    desc: "Tokens validados em todos os formulários do sistema.",
  },
  {
    icon: "KeyRound",
    title: "Hash Bcrypt",
    desc: "Senhas nunca são armazenadas em texto puro.",
  },
  {
    icon: "Fingerprint",
    title: "Auth via Sanctum",
    desc: "Autenticação por sessão com regeneração contra brute force.",
  },
  {
    icon: "Archive",
    title: "Soft Delete",
    desc: "Registros críticos preservados e auditáveis, nunca perdidos.",
  },
];

export const AVATAR = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=transparent`;
