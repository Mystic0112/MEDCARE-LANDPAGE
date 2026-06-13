import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedCare — Cuidar ficou mais inteligente",
  description:
    "A plataforma completa para gestão de clínicas sociais e comunitárias. Prontuário eletrônico, agendamento inteligente e controle de profissionais voluntários. Desenvolvido para a CESBEN.",
  keywords: [
    "gestão clínica",
    "saúde digital",
    "prontuário eletrônico",
    "agendamento inteligente",
    "voluntariado",
    "CESBEN",
    "clínica social",
  ],
  authors: [{ name: "Hélio Vinícius" }, { name: "Yan Seligman" }],
  openGraph: {
    title: "MedCare — Sistema de Gestão Clínica Inteligente",
    description:
      "A plataforma completa para gestão de clínicas sociais e comunitárias.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
