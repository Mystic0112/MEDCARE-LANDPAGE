import { Navbar } from "@/components/sections/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HeroAssembly } from "@/components/sections/HeroAssembly";
import { TrustBand } from "@/components/sections/TrustBand";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { SchedulingFlow } from "@/components/sections/SchedulingFlow";
import { RecordsTimeline } from "@/components/sections/RecordsTimeline";
import { RbacShowcase } from "@/components/sections/RbacShowcase";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterCta } from "@/components/sections/FooterCta";
import { LeadFormModal } from "@/components/ui/LeadFormModal";

/**
 * Landing page comercial do MedCare — direção "grife" monocromática.
 *
 * Server Component que compõe as seções na ordem do funil:
 *   Hero (explosão de componentes) → Faixa institucional CESBEN →
 *   [01] Recursos → [02] Agendamento → [03] Prontuário →
 *   [04] Controle de Acesso → [05] Segurança → [06] FAQ → CTA/Rodapé.
 *
 * `LeadFormModal` é montado uma única vez após o rodapé — abre em qualquer
 * ponto da página via CustomEvent "medcare:lead" (CTAs do Hero/Navbar/FAQ/CTA).
 *
 * `SmoothScroll` aplica rolagem suavizada (Lenis) com damping, sincronizada ao
 * GSAP ScrollTrigger. Uma grade cirúrgica de guias verticais fixas atravessa
 * toda a página por trás do conteúdo, reforçando a geometria do layout.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />

      {/* Grade cirúrgica global — guias verticais fixas (0 · 25 · 50 · 75 · 100%) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 flex justify-center"
      >
        <div className="relative h-full w-full max-w-6xl">
          <span className="absolute inset-y-0 left-0 w-px bg-foreground/[0.04]" />
          <span className="absolute inset-y-0 left-1/4 hidden w-px bg-foreground/[0.04] md:block" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-foreground/[0.04]" />
          <span className="absolute inset-y-0 left-3/4 hidden w-px bg-foreground/[0.04] md:block" />
          <span className="absolute inset-y-0 right-0 w-px bg-foreground/[0.04]" />
        </div>
      </div>

      <main className="relative">
        <HeroAssembly />
        <TrustBand />
        <FeaturesGrid />
        <SchedulingFlow />
        <RecordsTimeline />
        <RbacShowcase />
        <SecuritySection />
        <FaqSection />
      </main>

      <FooterCta />

      {/* Instância única do modal de leads — irmã das seções para não herdar
          containing block de ancestrais com backdrop-filter. */}
      <LeadFormModal />
    </>
  );
}
