import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

/**
 * Tipografia da marca:
 *  - Space Grotesk (display geométrica) → texto/títulos (var --font-sans)
 *  - Space Mono (monoespaçada)          → rótulos [NN], kickers, meta (var --font-mono)
 */
const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Aplica a classe `dark` no <html> antes do paint, lendo a preferência salva
 * (localStorage) ou, na ausência dela, o esquema do sistema. Evita o flash de
 * tema errado (FOUC) no primeiro carregamento.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
