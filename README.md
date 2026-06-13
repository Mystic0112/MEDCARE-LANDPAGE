# MedCare — Landing Page

> **Cuidar ficou mais inteligente.**
> Landing page comercial do MedCare, o Sistema de Gestão Clínica Inteligente
> desenvolvido para a **CESBEN** (Centro Social de Beneficência).

Página única, premium e minimalista (estilo Linear/Vercel), cuja Hero **monta o
sistema sozinha** conforme o usuário rola a página (GSAP ScrollTrigger `pin` + `scrub`).

---

## 🚀 Como rodar

```bash
npm install
npm run dev      # desenvolvimento  → http://localhost:3000
npm run build    # build de produção
npm run start    # serve o build
npm run typecheck
```

Stack: **Next.js 14 (App Router)** · **Tailwind CSS** · **GSAP + ScrollTrigger +
@gsap/react** · **Lucide React** · TypeScript.

---

## 🗂️ Arquitetura de arquivos

```
landpage MEDCARE/
├── app/
│   ├── layout.tsx              # Metadata (pt-BR/SEO), <html lang>, importa globals.css
│   ├── page.tsx                # Server Component — compõe as seções na ordem do funil
│   └── globals.css             # Tailwind + tokens CSS + utilitários (.ds-card, .ds-btn-*, .bg-grid…)
│
├── components/
│   ├── ui/                     # Primitivas genéricas
│   │   ├── Icon.tsx            # Renderiza ícone Lucide por nome (string)
│   │   ├── SectionHeading.tsx  # Eyebrow + título + subtítulo (suporta light/dark)
│   │   └── StatusBadge.tsx     # Badge de status (aguardando/confirmado/…)
│   │
│   ├── mockup/                 # Blocos do "app" do MedCare (reusados nos mockups)
│   │   ├── BrowserFrame.tsx    # A "carcaça" do navegador/monitor
│   │   ├── AppSidebar.tsx      # Sidebar 90px (HeartPulse + ícones, data-nav por item)
│   │   ├── AppHeader.tsx       # Header (busca rounded-full + sino + avatar)
│   │   ├── StatCard.tsx        # Stat card (accent primary/teal/purple)
│   │   └── ActivityChart.tsx   # Gráfico de atividade em SVG (barras .chart-bar)
│   │
│   └── sections/               # Seções da página (cada uma "use client" + GSAP próprio)
│       ├── Navbar.tsx          # Top bar fixa + toggle de tema + menu mobile
│       ├── HeroAssembly.tsx    # ⭐ Hero "Component Assembly" (pin + scrub)
│       ├── FeaturesGrid.tsx    # Grade de recursos (reveal escalonado)
│       ├── SchedulingFlow.tsx  # Agendamento inteligente (badge amarelo → teal)
│       ├── RecordsTimeline.tsx # Timeline de prontuário (parallax de profundidade)
│       ├── RbacShowcase.tsx    # RBAC interativo (Admin/Profissional/Secretário)
│       ├── SecuritySection.tsx # Segurança (CSRF · Bcrypt · Sanctum · Soft Delete)
│       └── FooterCta.tsx       # CTA final + rodapé (créditos CESBEN)
│
├── lib/
│   ├── gsap.ts                 # ⚙️ Ponto ÚNICO de registro do GSAP/ScrollTrigger/useGSAP
│   └── constants.ts            # Tokens (COLORS), NAV_ITEMS, ROLES (RBAC), dados de exemplo
│
├── docs/
│   └── DESIGN_CONTRACT.md      # Especificação de design/engenharia (fonte da verdade)
│
├── tailwind.config.ts          # Tokens de cor, rounded-card/panel, shadows, darkMode:'class'
├── next.config.mjs · tsconfig.json · postcss.config.js · package.json
```

**Por que essa estrutura?** Separar `ui` (genérico) → `mockup` (blocos do produto) →
`sections` (composição + animação) mantém cada seção autônoma e as primitivas
reutilizáveis. A Hero e a seção RBAC reaproveitam exatamente os mesmos blocos
(`AppSidebar`, `StatCard`…), garantindo que o mockup seja idêntico ao sistema real.

---

## ⚙️ A Hero "Component Assembly"

[`HeroAssembly.tsx`](components/sections/HeroAssembly.tsx) trava (`pin: true`) o conteúdo
no centro da tela e, com `scrub: 1`, vincula o progresso da timeline ao scroll. A
sequência de montagem segue a ordem pedida:

1. **Sidebar** desliza da esquerda (`xPercent: -120 → 0`).
2. **Header** desce do topo (`yPercent: -120 → 0`).
3. **3 Stat Cards** surgem do fundo com escala/profundidade (`scale: 0.6 → 1`, `back.out`, stagger).
4. **Gráfico**: o card sobe e as **barras crescem** (`scaleY: 0 → 1`, origem na base, stagger).

Um indicador de 4 passos (Sidebar · Header · Indicadores · Gráfico) acende conforme
cada etapa conclui. Ao final da timeline, o `pin` se desfaz e o scroll segue normal.

---

## 🧠 GSAP sem memory leaks

- **Registro único:** todos os plugins são registrados só em [`lib/gsap.ts`](lib/gsap.ts)
  (guardado por `typeof window`). As seções importam `gsap`, `ScrollTrigger` e `useGSAP`
  **somente** daí.
- **`useGSAP({ scope })`:** cada seção roda suas animações dentro do hook oficial
  `@gsap/react` com um `ref` de escopo. O hook **reverte todos os tweens e mata todos os
  ScrollTriggers** criados em seu contexto na desmontagem — sem `useEffect` manual,
  sem `ScrollTrigger.kill()`, sem vazamentos.
- **Sem flash:** estados iniciais são definidos com `gsap.set` dentro do callback (roda no
  layout effect, antes do paint).

---

## 📱 Responsividade (`gsap.matchMedia`)

Cada seção animada cria `gsap.matchMedia()` **dentro** do `useGSAP` (o contexto o reverte
automaticamente) com dois ramos:

```ts
mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
  // Experiência completa: pin · scrub · parallax
});
mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
  // Simplificado: fade/slide suave — SEM pin, SEM scrub, SEM parallax pesado
});
```

No mobile e para quem pede menos movimento (`prefers-reduced-motion`), o efeito **pin**
e o **parallax** são desativados: o sistema aparece **já montado** com um reveal leve, e
o mockup rola horizontalmente (`overflow-x-auto`) em telas pequenas, preservando
performance e usabilidade.

---

## 🎨 Design System

Tokens em [`tailwind.config.ts`](tailwind.config.ts) e [`globals.css`](app/globals.css):

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#4578FF` | Botões, ativos, sidebar |
| `teal` | `#00C2C7` | Confirmações, sucesso |
| `purple` | `#A033FF` | Destaques, evolução clínica |
| `amber` | `#FF9E00` | Alertas, aguardando |
| `canvas` | `#F8FAFC` | Fundo geral |

Cards `rounded-card` (36px), painéis `rounded-panel` (40px), botões `rounded-full`,
sombras ultraleves (`shadow-soft`), bordas quase invisíveis (`ring-1 ring-slate-200/60`).
Dark mode via classe (`darkMode: 'class'`) com toggle na Navbar.

---

## 👥 Créditos

Desenvolvido por **Hélio Vinícius** e **Yan Seligman** · **CESBEN — Centro Social de Beneficência**.
