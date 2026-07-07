# CLAUDE.md — MedCare Landing Page

**Project:** MedCare — Landing Page Comercial  
**Tech Stack:** Next.js 14, React 18, Tailwind CSS, GSAP, Lenis  
**Maintainers:** Hélio Vinícius, Yan Seligman  
**Last Updated:** 2026-07-06

---

## Rules for This Project

### 1. Code Organization

- **One section = one component** (`components/sections/*.tsx`)
- **UI primitives** live in `components/ui/` (Icon, SectionHeading, Badge, etc.)
- **Mockups** live in `components/mockup/` (AppSidebar, StatCard, ActivityChart, etc.)
- **Keep files ≤ 250 lines**; split if larger
- **Do NOT add new files unless required** — reuse existing utilities first

### 2. Design Language

- **Fonts:** Space Grotesk (display) + Space Mono (meta/labels)
- **Colors:** Monocromático (foreground/background) + 4 accents (primary/teal/purple/amber)
- **Spacing:** Use `clamp()` for responsive padding; no magic numbers
- **Grid:** 5 vertical guides (0%, 25%, 50%, 75%, 100%) in desktop; hidden on mobile
- **Contrast:** Minimum WCAG AA (4.5:1 for text, 3:1 for UI components)

### 3. Animations

- **Use GSAP + ScrollTrigger** for section reveals
- **Always wrap in `useGSAP()`** for automatic cleanup (no memory leaks)
- **Respect `prefers-reduced-motion`** with `gsap.matchMedia()`
- **No animation > 1.5s** (user impatience threshold)
- **Stagger desktop ≥ 0.06s**, mobile ≥ 0.04s

### 4. Accessibility (WCAG 2.1 AA)

- **Semantic HTML:** `<section>`, `<nav>`, `<footer>` with real `id=` attributes
- **Aria-labels:** Required on icon buttons, form inputs, interactive controls
- **Focus visible:** Custom `:focus-visible` ring (6px, primary color)
- **Color contrast:** Test with WAVE/Axe before committing
- **Dark mode:** Always test in both light and dark themes

### 5. Performance

- **No lazy loading components** (landing page is ~8 sections, fast)
- **Image optimization:** If adding images, use `next/image` with `priority` on above-fold
- **Bundle:** Keep ≤ 200KB (current: 170KB gzip ~50KB)
- **LCP:** Should be < 2.5s (monitor with `npm run build`)
- **Zero layout shift:** Use `will-change-transform` on animated elements

### 6. Responsive Breakpoints

- **Mobile:** 320px–767px (single column, touch-friendly)
- **Tablet:** 768px–1024px (2 columns where needed)
- **Desktop:** 1025px+ (3 columns, full width 6xl container)
- **Test:** Pixel 5 (375px), iPad (768px), 27" monitor

### 7. Git & Commits

- **Commits are atomic:** One feature/fix per commit
- **Message format:** `feat: add hero CTA modal` or `fix: contrast on kicker`
- **Branch naming:** `feat/hero-cta`, `fix/wcag-contrast`, `refactor/rbac-table`
- **Do NOT commit:** `.env`, `.env.local`, `node_modules/`, build artifacts
- **Review before push:** `npm run build && npm run typecheck` must pass

### 8. Data & Constants

- **All hardcoded data** lives in `lib/constants.ts`
- **If adding features:** Extract to constants immediately (no magic strings scattered)
- **Sections have real `id=`** attributes; nav links point to them

---

## Priority 1: Conversion Wins

### Must-Haves (next sprint)

- [ ] **Hero CTA** — Add "Solicitar acesso beta" button with real action
- [ ] **Lead form modal** — Capture name, email, institution (opens on CTA click)
- [ ] **Fix contrast** — Kicker `foreground/70`; test in WAVE
- [ ] **Focus ring** — Custom `:focus-visible` on all buttons

### Nice-to-Haves (if time)

- [ ] Social proof section (logos + 1–2 testimonios)
- [ ] FAQ accordion (5–8 questions)
- [ ] Security badges + LGPD compliance links

---

## Priority 2: Product Proof

- **Video demo:** 45s of real app flow (Novo Paciente → Agendamento → Prontuário)
- **GIF alternative:** If video unavailable, use animating GIF (max 20s loop)
- **Placement:** Hero stage, replacing static mockups (or below Features)

---

## Testing Checklist

Before any PR:

```bash
# Type checking
npm run typecheck

# Build
npm run build

# Manual checks
- [ ] Hero CTA visible and clickable
- [ ] Dark mode toggle works
- [ ] Mobile menu opens/closes
- [ ] Scroll animations play (no jank)
- [ ] Form validation works
- [ ] All links point to real URLs
- [ ] WCAG contrast passes (WAVE tool)
- [ ] No console errors

# Responsive
- [ ] Pixel 5 (375px)
- [ ] iPad (768px)
- [ ] Desktop (1440px)

# Accessibility
- [ ] Tab through all interactive elements
- [ ] Screen reader (NVDA/JAWS) announces headings
- [ ] Dark mode text readable
```

---

## Common Patterns

### Adding a New Section

```tsx
// components/sections/MySection.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animations here, scoped to root
  }, { scope: root });

  return (
    <section id="my-section" ref={root} className="py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="XX"
          kicker="Label"
          title="Title"
          subtitle="Optional"
        />
        {/* Content */}
      </div>
    </section>
  );
}
```

### Adding a Button

```tsx
// Use ds-btn-primary or ds-btn-ghost (defined in globals.css)
<a href="/target" className="ds-btn-primary">
  Label
  <Icon name="ArrowRight" className="h-4 w-4" />
</a>

// For <button> (not <a>):
<button
  type="button"
  onClick={handleClick}
  aria-label="Description"
  className="ds-btn-primary"
>
  Click me
</button>
```

### Adding a Form Input

```tsx
<div>
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    placeholder="seu@email.com"
    aria-required="true"
    className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  />
</div>
```

---

## Debugging

### GSAP animations not triggering
- Check `scope: root` is passed to `useGSAP()`
- Verify selector (`.class-name`) matches rendered DOM
- Check ScrollTrigger isn't firing too early (use `start: "top 80%"`)

### Mobile menu doesn't close
- Ensure `onClick={() => setMenuOpen(false)}` on all links
- Verify max-height/opacity transitions are in place

### Dark mode not persisting
- Check localStorage is available (privacy mode blocks it)
- Verify `themeInitScript` runs before paint in layout.tsx

### Contrast fails in WCAG
- Use WAVE browser extension to identify
- Swap `foreground/XX` to higher value (e.g., `/50` → `/70`)
- Test both light AND dark themes

---

## Deployment

- **Host:** Vercel (optimal for Next.js)
- **Domain:** `medcare.com.br` (or TBD)
- **Analytics:** Plausible (privacy-friendly, no cookies)
- **Monitoring:** Vercel Speed Insights

### Pre-deploy checklist

```bash
npm run build          # Must succeed
npm run typecheck      # No errors
WAVE audit            # No WCAG failures
npm run lint          # No eslint warnings
git log --oneline     # Meaningful commit messages
```

---

## Contacts & References

- **Product:** Hélio Vinícius (helio.vinicius@gorilash.com.br)
- **Design feedback:** Yan Seligman
- **CESBEN contact:** [TBD]
- **Figma:** [Link if exists]
- **Analytics dashboard:** [Link if exists]

---

## Future Enhancements (Backlog)

- [ ] Pricing page (separate route)
- [ ] Blog/case studies
- [ ] Chatbot (intercom/drift)
- [ ] Email drip campaign (ConvertKit/Substack)
- [ ] A/B testing framework (Vercel Experiments)
- [ ] Storybook for UI components
- [ ] E2E tests (Playwright)

---

## Notes

1. **This is a "grife" (premium brand) landpage** — minimalist aesthetic, no compromise on typography or spacing. Every pixel matters.

2. **No component bloat** — if adding features, resist over-engineering. One feature per PR.

3. **CESBEN partnership** — mention it honestly, not as social proof (they're the stakeholder, not a happy customer yet).

4. **Conversions win games** — fancy animations are 10%; clear copy + visible CTA + social proof is 90%.

