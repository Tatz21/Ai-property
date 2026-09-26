# 11 — RULES.md

> **These rules are mandatory implementation constraints for Antigravity.**

---

## 1. Engineering Rules
- **TypeScript Strict Mode**: Zero implicit `any`, no knowingly suppressed type errors.
- **Zero Broken Builds**: No build, lint, or type check errors allowed in repository commits.
- **No Fake / Dead Buttons**: Every visible UI action must either function end-to-end or be explicitly flagged as disabled/coming soon.
- **No Mock API Responses**: Production code paths must hit real database/backend handlers.
- **Data Integrity**: No hardcoded mock properties or customers in production runtime, only structured seed fixtures for development and testing.
- **Component Architecture**: Reusable components over duplicated ad-hoc JSX.
- **Centralized Schema & Constants**: Single sources of truth for validation schemas, error types, role constants, and permission definitions.
- **Async State Coverage**: Every asynchronous feature must provide explicit Loading, Empty, Error, and Success states.

---

## 2. AI Rules
- **Assistant Boundary**: AI is an intelligent assistant, not the authoritative source of truth for inventory.
- **Database Supremacy**: Live database availability and pricing always override AI conversational memory.
- **Zero Hallucinations**: The AI must never invent non-existent properties, pricing, or locations.
- **Fact Citation**: The AI must explain match reasons citing actual property features and verified attributes.
- **Graceful Escalation**: If the AI is uncertain or cannot fulfill a request, hand off to deterministic filters, help documentation, or human agents.
- **Tool Authorization**: Every AI tool invocation is strictly authorized and schema-validated.

---

## 3. UX & Design Rules
- **Full Responsiveness**: First-class experience across mobile (touch), tablet, and desktop viewports.
- **Accessible Interactions**: No hover-only hidden actions; keyboard accessibility and visible focus rings required.
- **Destructive Action Safety**: Every deletion, cancellation, or irreversible mutation requires explicit confirmation.
- **Form Feedback**: Inline validation and field-level error messages on all forms.
- **Progress Communication**: Informative visual progress indicators on long-running async operations.
- **Design System Fidelity**: Faithfully implement and reuse the supplied `GenerateButton`, `FeatCard/Bento`, `TestimonialsCard`, `SpotlightNavbar`, and `PerspectiveGrid` components.

---

## 4. Business & Operational Rules
- **Commission Integrity**: Commission figures must be computed server-side from immutable transaction records.
- **Lead Attribution**: Lead attribution is locked after the defined attribution window, modifiable only via logged admin overrides.
- **Territory Routing**: Leads are assigned exclusively to eligible agents verified for that specific micro-market and property category.
- **Visit Booking Guard**: Unavailable, under-offer, or unverified properties cannot accept visit bookings.
- **Trust Badges**: Trust and verification badges must correspond directly to validated database audit records.
