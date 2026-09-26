# 03 — DESIGN.md

> **The supplied code is the visual reference. Preserve its character and turn it into a reusable design system.**

---

## 1. Design Direction
- **Visual**: Premium AI/PropTech, minimal, monochrome foundation with restrained cyan/violet/amber/emerald accents.
- **Surface**: White in light mode, near-black in dark mode, subtle borders, layered shadows, glass/ambient lighting where appropriate.
- **Typography**: Inter/Poppins-like modern sans for UI; mono for system metrics, statuses and technical metadata.
- **Motion**: Purposeful Framer Motion transitions; no excessive motion that hurts performance or accessibility.
- **Cards**: Rounded 20px-ish surfaces, thin borders, subtle depth, inset highlights and responsive grids.

---

## 2. Mandatory Reference Components

| Component | Implementation Requirement |
| :--- | :--- |
| **`GenerateButton`** | Use the supplied component style for primary AI actions such as *Generate Matches*, *Find Properties*, *Analyze*, *Search with AI*, and *Generate Shortlist*. |
| **`TestimonialsCard`** | Use the supplied stacked-card motion language for testimonials, customer stories, and optionally property story cards. |
| **`FeatCard / Bento`** | Use the supplied card construction for product capability sections, dashboard metric groups, and AI feature showcases. |
| **`SpotlightNavbar`** | Use the supplied spotlight/ambient navigation treatment for public website navigation and selected dashboard navigation where appropriate. |
| **`PerspectiveGrid`** | Use as a subtle hero/background visual. Never sacrifice text contrast or accessibility. |

---

## 3. Button Design Language
- **Primary AI Action Buttons**: Visually inherit the supplied `GenerateButton` behavior: dark base, rounded 24px, highlight hue, animated letters, sparkle icon, and generating state.
- **Normal CRUD Buttons**: Use the same visual DNA but do not all animate like AI generation.
- **State Coverage**: Every button must have hover, active, focus-visible, disabled, and loading states.
- **Destructive Actions**: Must use explicit confirmation and a distinct danger treatment.
- **Icon-only Buttons**: Require `aria-label` and tooltip where useful.

---

## 4. Box / Card System
- Use the supplied `FeatCard` geometry as baseline: rounded 20px, thin border, subtle shadow, clipped visual area, and responsive sizing.
- **Property Cards**: Prioritize image, price, location, key facts, verification badge, and primary CTA.
- **Dashboard Cards**: Support compact density while retaining the same depth and border language.
- Avoid excessive gradients, oversized glass panels, and decorative elements that compete with property content.

---

## 5. Customer UI
- AI conversation is the primary discovery interface.
- Property results should appear as clean cards within the conversation or a synchronized result panel.
- Use persistent shortlist and compare controls.
- Visit booking should be a simple stepper/modal with date, time, and confirmation.
- Mobile experience must be first-class.

---

## 6. Accessibility (a11y)
- Fully keyboard navigable.
- High-visibility focus states.
- Respect `prefers-reduced-motion`.
- Text/background contrast must meet WCAG AAA/AA accessible standards.
- Never communicate status by color alone.
- All images require meaningful and descriptive alt text.
