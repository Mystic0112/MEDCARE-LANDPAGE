import { Navbar } from "@/components/sections/Navbar";
import { HeroAssembly } from "@/components/sections/HeroAssembly";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { SchedulingFlow } from "@/components/sections/SchedulingFlow";
import { RecordsTimeline } from "@/components/sections/RecordsTimeline";
import { RbacShowcase } from "@/components/sections/RbacShowcase";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { FooterCta } from "@/components/sections/FooterCta";

/**
 * Landing page comercial do MedCare.
 *
 * Server Component que compõe as seções (Client Components) na ordem do
 * funil: Hero (montagem do sistema) → Recursos → Agendamento → Prontuário
 * → Controle de Acesso → Segurança → CTA/Rodapé.
 *
 * Cada seção é autônoma e gerencia suas próprias animações GSAP via
 * `useGSAP` (cleanup automático, sem memory leaks) e `gsap.matchMedia`
 * (pin/parallax somente no desktop).
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <HeroAssembly />
        <FeaturesGrid />
        <SchedulingFlow />
        <RecordsTimeline />
        <RbacShowcase />
        <SecuritySection />
      </main>
      <FooterCta />
    </>
  );
}
