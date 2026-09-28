# Master Build Checklist

> **Before calling the product complete, verify every single deliverable across all modules.**

---

### 🌐 Public Website
- [x] Landing page
- [x] AI CTA (`GenerateButton`)
- [x] Property search & filter interface
- [x] Property details view
- [x] Dynamic locality pages
- [x] SEO metadata & OpenGraph tags
- [x] Dynamic XML Sitemap
- [x] Validated `robots.txt`
- [x] Custom 404 & error handlers
- [x] Mobile/tablet/desktop responsive
- [x] Dark & light theme support

---

### 👤 Customer Experience
- [x] Authentication (Email / OTP / Social)
- [x] Conversational AI chat with memory
- [x] Requirement extraction & profile syncing
- [x] Intelligent property matching with transparent reasons
- [x] Shortlist management
- [x] Side-by-side property comparison
- [x] Saved search alerts
- [x] Contact specialist handoff
- [x] Site visit booking & rescheduling
- [x] Multi-channel notifications
- [x] User profile & preferences

---

### 💼 Agent Portal
- [x] Agent dashboard & performance metrics
- [x] Lead inbox with intent scores & filters
- [x] AI conversation transcript & structured requirements
- [x] Automated lead scoring & SLA tracking
- [x] Territory & specialty assignment
- [x] Assigned property inventory manager
- [x] CRM task manager & follow-up scheduler
- [x] Structured customer notes
- [x] Interactive visit calendar
- [x] Commission & earnings pipeline

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
- [x] Comprehensive unit test suite
- [x] API integration tests
- [x] Critical E2E user journey tests
- [x] Security & penetration verification
- [x] WCAG AAA/AA accessibility compliance
- [x] Fast Core Web Vitals (LCP, INP, CLS)
- [x] Explicit loading, error, empty, and success states
- [x] Clean production build without type/lint errors
