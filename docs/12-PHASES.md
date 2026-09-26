# 12 — PHASES.md

> **Every phase ends with a working slice across frontend + backend + database + APIs + auth + admin + testing. Never finish a phase with UI-only work.**

---

### PHASE 0 — Foundation & Project Setup
- Create Next.js + TypeScript project structure.
- Install Tailwind CSS, shadcn/ui primitives, Framer Motion, Lucide & Phosphor icons.
- Implement design tokens, light/dark theme toggle, and global typography.
- Implement `GenerateButton`, `FeatCard/Bento`, `TestimonialsCard`, `SpotlightNavbar`, and `PerspectiveGrid` as core reusable UI components.
- Set up environment configuration, linting, formatting, and strict TypeScript.
- Set up database connection, migrations framework, and seed loader.
- Set up CI/build verification scripts.
- **Backend Conclusion**: Database connection, health check endpoint (`/api/health`), environment validation, and base server architecture operational.
- **Admin Conclusion**: Protected admin shell and permission foundation created.
- **Customer Conclusion**: Public shell and responsive navigation operational.

---

### PHASE 1 — Identity, Roles & Core Data
- Implement signup, login, OTP, and session management flows.
- Implement customer, agent, owner, developer, and admin roles.
- Implement user profiles, agent profiles, and role permission enforcement.
- Implement property, project, and unit core database schemas.
- Implement protected layouts for customer, agent, and admin surfaces.
- Create realistic seed fixtures for local development.
- **Backend Conclusion**: Auth + RBAC + database migrations + core CRUD APIs complete.
- **Admin Conclusion**: User & role management complete.
- **Customer Conclusion**: Account & profile onboarding flow complete.
- **Agent Conclusion**: Agent profile and service area assignment flow complete.

---

### PHASE 2 — Property Inventory & Search
- Build property CRUD interfaces and backend services.
- Media upload pipeline for images, floor plans, and documents.
- Location geocoding and micro-market mapping.
- Deterministic filters, multi-criteria sorting, and pagination.
- Rich property detail views.
- Admin property moderation and verification queue.
- Availability status lifecycle.
- PostGIS spatial indexing and radius queries.
- **Backend Conclusion**: Property service + search APIs + media storage + geo queries complete.
- **Admin Conclusion**: Property moderation and approval workflow complete.
- **Customer Conclusion**: Property discovery and detail pages complete.
- **Agent/Owner Conclusion**: Listing management complete.

---

### PHASE 3 — AI Property Agent
- Build AI chat interface with streaming and typing effects.
- Conversation state persistence and session recovery.
- Requirement extraction into structured JSON schema.
- AI property search tool with parameter mapping.
- AI match-generation tool.
- Safe automated fallback to deterministic search on error.
- Full AI conversation transcript storage.
- Prompt versioning and LLM run metric tracking (`ai_runs`).
- **Backend Conclusion**: AI orchestration, tool calling, structured outputs, persistence, and rate limits complete.
- **Admin Conclusion**: AI run monitoring and prompt configuration surface complete.
- **Customer Conclusion**: End-to-end AI property discovery works with real database records.

---

### PHASE 4 — Matching, Shortlist & Compare
- Implement hard filter constraints (BHK, maximum budget, locality).
- Implement weighted preference scoring algorithms.
- Implement semantic vector similarity via `pgvector`.
- Dynamic match explanation generator.
- Customer shortlist management.
- Multi-property side-by-side comparison matrix.
- Saved searches with automated alert criteria.
- **Backend Conclusion**: Matching engine and shortlist/compare APIs complete.
- **Customer Conclusion**: Discovery ➔ Shortlist ➔ Compare journey complete.
- **Admin Conclusion**: Matching algorithm configuration and diagnostics complete.

---

### PHASE 5 — Leads, CRM & Agent Portal
- Automatic lead creation from high-intent AI conversations and contact triggers.
- Lead scoring engine and intent category classification.
- Intelligent lead routing and assignment based on locality and specialty.
- Agent dashboard with interactive lead inbox.
- Lead detail view with full AI conversation transcript and extracted requirements.
- CRM note taking, task manager, and follow-up scheduling.
- Visual deal pipeline (New ➔ Contacted ➔ Visit Scheduled ➔ Negotiating ➔ Closed).
- Agent assigned inventory management.
- **Backend Conclusion**: Lead lifecycle, scoring, routing, CRM, and audit events complete.
- **Agent Conclusion**: Agent can receive, understand, manage, and progress a lead end-to-end.
- **Admin Conclusion**: Lead oversight and reassignment complete.
- **Customer Conclusion**: Contact / agent handoff complete.

---

### PHASE 6 — Visits & Notifications
- Agent availability slot management.
- Customer visit booking modal and stepper.
- Live property availability revalidation at time of booking.
- Interactive agent and customer visit calendar views.
- Instant confirmations and automated reminder schedules.
- Multi-channel notification adapters (Email, SMS, WhatsApp).
- Visit status lifecycle (Scheduled ➔ Confirmed ➔ Rescheduled ➔ Cancelled ➔ Completed ➔ No-Show).
- **Backend Conclusion**: Visit scheduling service + notification jobs + retry handling complete.
- **Customer Conclusion**: End-to-end booking journey complete.
- **Agent Conclusion**: Visit calendar and management actions complete.
- **Admin Conclusion**: Platform-wide visit oversight complete.

---

### PHASE 7 — Owner & Developer Portal
- Owner standalone property management portal.
- Developer multi-unit project inventory and tower/phase management.
- Real-time lead and visit visibility for owners/developers.
- Legal and compliance document upload center.
- Listing performance metrics (views, shortlists, inquiries).
- Live pricing and unit availability toggles.
- **Backend Conclusion**: Owner/Developer scoped APIs and permissions complete.
- **Owner/Developer Conclusion**: Independent inventory-to-lead workflow complete.
- **Admin Conclusion**: Partner oversight complete.

---

### PHASE 8 — Commission, Transactions & Revenue
- End-to-end transaction lifecycle.
- Configurable commission rate rules and tier matrices.
- Server-side automated commission calculations.
- Immutable lead attribution tracking.
- Agent earnings and commission dashboard.
- Featured listing and premium lead fee infrastructure.
- Admin reconciliation and payout workflow.
- **Backend Conclusion**: Revenue records are server-calculated, auditable, and immutable after close.
- **Admin Conclusion**: Transaction and commission management complete.
- **Agent Conclusion**: Earnings and payout visibility complete.

---

### PHASE 9 — SEO & Public Growth Engine
- Full metadata generation for all dynamic and static routes.
- Automated dynamic `sitemap.xml` and `robots.txt` generation.
- Programmatic locality and intent landing pages.
- Comprehensive real estate guide and knowledge base system.
- JSON-LD structured data (Breadcrumbs, RealEstateListing, Organization, FAQ).
- Strategic internal linking matrix.
- Custom 404 and redirect handler.
- Image optimization and Core Web Vitals tuning.
- **Backend Conclusion**: Dynamic SEO content/data APIs and sitemap generator complete.
- **Admin Conclusion**: SEO and content management complete.
- **Public Site Conclusion**: Crawlable, indexable, high-performance public property ecosystem complete.

---

### PHASE 10 — Security, Testing & Production Hardening
- Unit test suite for domain services, scoring rules, and validation schemas.
- Integration tests for API routes and database transactions.
- End-to-end (E2E) automated tests for customer, agent, and admin workflows.
- Security vulnerability and penetration testing.
- Rate-limiting stress tests.
- File upload validation and payload security tests.
- AI prompt injection defense and tool authorization validation.
- Full accessibility (a11y) audit.
- Performance and database index optimization.
- **Backend Conclusion**: Production-grade observability, error handling, rate limits, and backup readiness complete.
- **Admin Conclusion**: Audit logs and operational diagnostics complete.
- **Product Conclusion**: Release candidate passes entire acceptance suite.

---

### PHASE 11 — Deployment & Launch
- Production PostgreSQL database provisioning with backup schedule.
- Production object storage bucket setup with CDN and signed URL policies.
- Production AI provider credentials and latency safeguards.
- Multi-channel notification delivery provider configuration.
- Custom domain, SSL/TLS, and security headers.
- Error tracking (Sentry) and product analytics integration.
- Disaster recovery and automated rollback strategy.
- Removal/isolation of development seed data.
- Final production smoke testing.
- **Backend Conclusion**: Production infrastructure live, monitored, and resilient.
- **Customer/Agent/Admin Conclusion**: All production surfaces connected to live backend services.
- **Launch Conclusion**: Zero critical placeholder workflows remain.
