# MedCare Landing — Design & Engineering Contract

> **Authoritative spec.** Every section component MUST follow this exactly so the
> page stays visually and architecturally coherent. Read this fully before coding.

## Project

- **Next.js 14 App Router**, TypeScript, Tailwind v3, GSAP + ScrollTrigger + `@gsap/react`, Lucide.
- Path alias: `@/*` → project root. Components live in `components/`, data in `lib/`.
- Single-page landing. `app/page.tsx` composes the section components in order.

## Color tokens (Tailwind classes)

| Token | Class | Hex |
|---|---|---|
| Primary Blue | `primary` / `bg-primary` `text-primary` | `#4578FF` |
| Primary soft | `primary-soft` | `#E8F0FF` |
| Teal | `teal` | `#00C2C7` |
| Teal soft | `teal-soft` | `#E0F8FC` |
| Purple | `purple` | `#A033FF` |
| Purple soft | `purple-soft` | `#F5E8FF` |
| Amber | `amber` | `#FF9E00` |
| Amber soft | `amber-soft` | `#FFECCC` |
| Destructive | `destructive` | `#EF4444` |
| Canvas (page bg) | `bg-canvas` | `#F8FAFC` |
| Card | `bg-card` | `#FFFFFF` |
| Muted text | `text-muted` | `#94A3B8` |
| Ink (main text) | `text-ink` | `#0F172A` |

For SVG fills / inline GSAP styles, import HEX from `COLORS` in `@/lib/constants`.

## Radius / shadow / utility classes (already in `globals.css` + tailwind config)

- Radius: `rounded-card` (36px), `rounded-panel` (40px), plus `rounded-full` pills.
- Shadows: `shadow-soft` (ultralight), `shadow-float`, `shadow-glow` (primary halo).
- Component classes: `.ds-card`, `.ds-btn-primary`, `.ds-btn-ghost`, `.ds-pill`, `.ds-kicker`.
- Utilities: `.text-gradient`, `.no-scrollbar`, `.bg-grid`, `.bg-grid-fade`.
- Style = Linear/Vercel premium minimalist: lots of whitespace, near-invisible borders
  (`ring-1 ring-slate-200/60`), pill buttons, rounded cards.

## Reusable primitives — import & use these, do NOT re-implement

```tsx
import { Icon } from "@/components/ui/Icon";                 // <Icon name="HeartPulse" className="h-5 w-5" style={{color}} />
import { SectionHeading } from "@/components/ui/SectionHeading"; // {kicker?, kickerIcon?, title, subtitle?, align?:'center'|'left', light?, className?}
import { StatusBadge } from "@/components/ui/StatusBadge";    // {status:'aguardando'|'confirmado'|'concluida'|'cancelado'}
import { StatCard } from "@/components/mockup/StatCard";      // {title, value, sub?, icon, accent?:'primary'|'teal'|'purple', ...divProps}
import { AppSidebar } from "@/components/mockup/AppSidebar";  // {activeId?, ...asideProps} — renders all nav, each <button data-nav={id}>
import { AppHeader } from "@/components/mockup/AppHeader";    // {title?, ...headerProps}
import { ActivityChart } from "@/components/mockup/ActivityChart"; // {...divProps} — bars are <rect class="chart-bar"> origin-bottom
import { BrowserFrame } from "@/components/mockup/BrowserFrame"; // {children, ...divProps} — the empty mockup chrome
```

Data from `@/lib/constants`: `COLORS, NAV_ITEMS, ROLES, STAT_CARDS, ACTIVITY_BARS, STATUS_META, SECURITY_FEATURES, AVATAR(seed)` plus types `StatusKey, RoleKey`.

`StatCard`, `AppSidebar`, `AppHeader`, `ActivityChart`, `BrowserFrame` all spread extra
props, so you can attach `data-*` hooks and extra `className` for GSAP targeting.

## GSAP rules (NON-NEGOTIABLE — graded on this)

1. Any component using GSAP starts with `"use client";`.
2. Import GSAP only from the central module: `import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";` (never call `gsap.registerPlugin` again).
3. Use a root `useRef<HTMLElement>(null)` and run animations inside
   `useGSAP(() => { ... }, { scope: rootRef })`. Selector strings inside the callback
   are auto-scoped to the root — `useGSAP` reverts all tweens AND kills all ScrollTriggers
   created in its context on unmount. **Do NOT** write manual `useEffect` cleanup or call
   `ScrollTrigger.kill()` yourself — that is the whole point of `useGSAP` (no memory leaks).
4. **Responsive via `gsap.matchMedia()`** created INSIDE the `useGSAP` callback (the context
   reverts it automatically):
   ```tsx
   useGSAP(() => {
     const mm = gsap.matchMedia();
     mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
       // FULL experience: pin / scrub / parallax
     });
     mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
       // SIMPLIFIED: gentle fade/slide reveals, NO pin, NO scrub, NO heavy parallax
     });
   }, { scope: root });
   ```
   On mobile / reduced-motion: never `pin`, never `scrub`, no parallax `y` translation tied
   to scroll. Content must be fully visible and usable. A simple `from({opacity,y:24})`
   reveal with `scrollTrigger: { trigger, start: "top 80%" }` is the mobile pattern.
5. To avoid first-paint flash, set initial states with `gsap.set(...)` inside the callback
   (runs before paint via `useGSAP`'s layout effect), or use `.from()`.

## Section ids & order (Navbar anchors link to these)

`#inicio` Hero → `#recursos` Features → `#agendamento` Scheduling →
`#prontuario` Records timeline → `#acesso` RBAC → `#seguranca` Security → `footer`.

Each section component renders a top-level `<section id="...">` (Navbar/Footer excepted).
Use generous vertical padding: `py-24 sm:py-32`. Center content in `mx-auto max-w-6xl px-5 sm:px-8`.

## Theme / dark mode

`darkMode: 'class'`. The Navbar owns a toggle that does
`document.documentElement.classList.toggle('dark')`. Sections should look great in light
mode (primary target); dark variants are nice-to-have on key surfaces only.

## Tone / language

Portuguese (pt-BR). Professional, warm, confident. Slogan: **"Cuidar ficou mais inteligente."**
Tagline: "A plataforma completa para gestão de clínicas sociais e comunitárias." Brand: CESBEN.

## File / export conventions

- One default-free **named export** per file matching the component name (e.g. `export function HeroAssembly() {}`).
- TypeScript strict: type all props; no `any` unless unavoidable (then `// eslint-disable` is fine).
- Use `next/image`? No — for DiceBear/sample avatars use plain `<img>` with the eslint-disable
  comment (already done in primitives). Keep it simple.
- Accessibility: decorative mockup buttons get `tabIndex={-1}`; real CTAs are `<a>`/`<button>`.
