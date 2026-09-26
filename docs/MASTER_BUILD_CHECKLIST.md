# Master Build Checklist

> **Before calling the product complete, verify every single deliverable across all modules.**

---

### 🌐 Public Website
- [ ] Landing page
- [ ] AI CTA (`GenerateButton`)
- [ ] Property search & filter interface
- [ ] Property details view
- [ ] Dynamic locality pages
- [ ] SEO metadata & OpenGraph tags
- [ ] Dynamic XML Sitemap
- [ ] Validated `robots.txt`
- [ ] Custom 404 & error handlers
- [ ] Mobile/tablet/desktop responsive
- [ ] Dark & light theme support

---

### 👤 Customer Experience
- [ ] Authentication (Email / OTP / Social)
- [ ] Conversational AI chat with memory
- [ ] Requirement extraction & profile syncing
- [ ] Intelligent property matching with transparent reasons
- [ ] Shortlist management
- [ ] Side-by-side property comparison
- [ ] Saved search alerts
- [ ] Contact specialist handoff
- [ ] Site visit booking & rescheduling
- [ ] Multi-channel notifications
- [ ] User profile & preferences

---

### 💼 Agent Portal
- [ ] Agent dashboard & performance metrics
- [ ] Lead inbox with intent scores & filters
- [ ] AI conversation transcript & structured requirements
- [ ] Automated lead scoring & SLA tracking
- [ ] Territory & specialty assignment
- [ ] Assigned property inventory manager
- [ ] CRM task manager & follow-up scheduler
- [ ] Structured customer notes
- [ ] Interactive visit calendar
- [ ] Commission & earnings pipeline

---

### 🏢 Owner / Developer Portal
- [x] Standalone property listing manager
- [x] Multi-unit project & tower manager
- [x] Real-time unit availability & pricing controls
- [x] Document & legal title upload center
- [x] Lead & inquiry tracking
- [x] Site visit request approval
- [x] Listing performance analytics

---

### 🛡️ Admin Surface
- [x] Executive global dashboard
- [x] User & RBAC role administration
- [x] Property moderation & verification queue
- [x] Agent onboarding & service-area mapping
- [x] Configurable lead routing engine
- [x] Site visit platform oversight
- [x] AI run telemetry & prompt configuration
- [x] Programmatic SEO & CMS management
- [x] Revenue, commission tiers, and transaction ledger
- [x] Comprehensive immutable audit logs
- [x] System settings & provider toggles

---

### ⚙️ Backend Architecture
- [x] Session authentication & token security
- [x] Server-side RBAC enforcement
- [x] Strict Zod API schema validation
- [x] Property CRUD & search services
- [x] PostGIS geospatial radius search
- [x] AI orchestrator with tool calling & fallback
- [x] Hybrid matching engine (rules + pgvector)
- [x] Lead lifecycle, scoring & routing engine
- [x] CRM notes & task management service
- [x] Idempotent visit scheduling engine
- [x] Notification dispatchers (Email, SMS, WhatsApp)
- [x] Transaction & commission calculations
- [x] Audit logging middleware
- [x] Health checks & system monitoring

---

### 🧪 Quality & Hardening
- [ ] Comprehensive unit test suite
- [ ] API integration tests
- [ ] Critical E2E user journey tests
- [ ] Security & penetration verification
- [ ] WCAG AAA/AA accessibility compliance
- [ ] Fast Core Web Vitals (LCP, INP, CLS)
- [ ] Explicit loading, error, empty, and success states
- [ ] Clean production build without type/lint errors
