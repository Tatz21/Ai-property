# EstateAI Kolkata — AI Property Discovery, Intelligence & Transaction Platform

> **AI-first real estate discovery, qualification, and transaction platform for India.**  
> Initial Launch Market: **Kolkata Micro-Markets (New Town, Salt Lake Sector V, Rajarhat, EM Bypass, Ballygunge, Alipore)**  
> Primary Business Model: **Verified RERA inventory + AI qualification + 2% transaction commission**  
> Build Target: **Production-ready full-stack web application (Phases 0 through 11 Complete)**

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Automated Test Suite (Vitest)
```bash
npm test
# 7 Domain Test Suites, 26/26 Tests Passing
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Production Build
```bash
npm run build
# 65/65 routes compiled cleanly
```

---

## 🌟 Key Features & Surfaces

### 1. Public Discovery & SEO Growth Engine
- **Homepage (`/`)**: Next-gen dark mode aesthetic with `PerspectiveGrid`, `SpotlightNavbar`, `GenerateButton`, interactive search, and Kolkata market pulse.
- **Locality Guides (`/kolkata/[locality]`)**: Programmatic SEO landing pages for New Town, Salt Lake, Rajarhat, EM Bypass, Ballygunge, and Alipore with live price-per-sq.ft trends and FAQ JSON-LD schemas.
- **Intent Landing Pages (`/explore/[slug]`)**: Dynamic search intent hubs (e.g. `2-bhk-flats-in-kolkata`, `3-bhk-luxury-apartments-kolkata`).
- **Knowledge Base (`/guides`)**: In-depth buyer guides on WBRERA compliance, home loan tax deductions (Sec 80C & 24b), and Kolkata stamp duty slabs.
- **Dynamic Sitemaps (`/sitemap.xml`) & Crawler Directives (`/robots.txt`)**.

### 2. Conversational AI Property Agent
- **AI Chat (`/ai-chat`)**: Context-aware natural language discovery engine (`v1.2-kolkata-agent`) with real-time property database tool-calling, requirement extraction, and transparent match scoring.

### 3. Customer Portal
- **Shortlist (`/customer/shortlist`)**: Saved properties with custom notes.
- **Side-by-Side Compare (`/properties/compare`)**: Multi-property matrix comparing RERA ID, price per sq.ft, carpet area, and amenities.
- **Saved Searches (`/customer/saved-searches`)**: Automated instant alerts.
- **Site Visits (`/customer/visits`)**: Idempotent scheduling with collision prevention.

### 4. Agent Portal
- **Agent CRM Dashboard (`/agent/dashboard`)**: Pipeline stages, lead temperature, SLA tracking, and territory routing.
- **Lead Detail (`/agent/leads/[id]`)**: Full AI conversation transcript, structured requirements, CRM task scheduler, and notes timeline.
- **Commissions & Earnings (`/agent/commissions`)**: Real-time 60/40 commission ledger and payout status.
- **Visit Calendar (`/agent/visits`)**: Scheduled buyer appointments.

### 5. Developer & Owner Portal
- **Developer Dashboard (`/developer/dashboard`)**: Multi-tower project management, inventory controls, and lead analytics.
- **Owner Dashboard (`/owner/dashboard`)**: Verified resale and rental listing management.

### 6. Admin Mission Control
- **Executive Dashboard (`/admin`)**: Platform KPI telemetry and active audits.
- **User & RBAC (`/admin/users`)**: Role and permission administration.
- **Property Moderation (`/admin/properties`)**: WBRERA verification queue.
- **Revenue & Commissions (`/admin/revenue`)**: Platform GMV and payout reconciliation.
- **AI Telemetry (`/admin/ai`)**: Prompt versioning and inference telemetry.
- **Matching Engine (`/admin/matching`)**: Real-time weight tuning.
- **SEO & Growth (`/admin/seo`)**: Sitemap and crawler management.
- **Security Center (`/admin/security`)**: CSP, rate-limiting, and AI prompt injection defense monitor.
- **Launch Center (`/admin/launch`)**: Master 12-phase verification and E2E smoke tests.

---

## 📑 Master Specification Docs (`/docs`)

1. [01 — PRD (Product Requirements Document)](file:///Users/tatz/AI%20Property%20Search/docs/01-PRD.md)
2. [02 — Architecture](file:///Users/tatz/AI%20Property%20Search/docs/02-ARCHITECTURE.md)
3. [03 — Design System & UI Specifications](file:///Users/tatz/AI%20Property%20Search/docs/03-DESIGN.md)
4. [04 — Tech Stack & Environment Configuration](file:///Users/tatz/AI%20Property%20Search/docs/04-TECH-STACK.md)
5. [05 — Database Schema & Data Modeling](file:///Users/tatz/AI%20Property%20Search/docs/05-DATABASE.md)
6. [06 — API Specification](file:///Users/tatz/AI%20Property%20Search/docs/06-API.md)
7. [07 — Features & Capabilities Matrix](file:///Users/tatz/AI%20Property%20Search/docs/07-FEATURES.md)
8. [08 — Core User Flows](file:///Users/tatz/AI%20Property%20Search/docs/08-USER-FLOWS.md)
9. [09 — SEO & Public Growth Engine](file:///Users/tatz/AI%20Property%20Search/docs/09-SEO.md)
10. [10 — Security & Trust Guidelines](file:///Users/tatz/AI%20Property%20Search/docs/10-SECURITY.md)
11. [11 — Engineering & Business Rules](file:///Users/tatz/AI%20Property%20Search/docs/11-RULES.md)
12. [12 — Phased Implementation Plan (Phases 0 to 11)](file:///Users/tatz/AI%20Property%20Search/docs/12-PHASES.md)
13. [13 — Testing Strategy & Quality Assurance](file:///Users/tatz/AI%20Property%20Search/docs/13-TESTING.md)
14. [14 — Deployment, CI/CD & Observability](file:///Users/tatz/AI%20Property%20Search/docs/14-DEPLOYMENT.md)
15. [15 — Changelog & Specification Governance](file:///Users/tatz/AI%20Property%20Search/docs/15-CHANGELOG.md)
16. [Master Build Checklist](file:///Users/tatz/AI%20Property%20Search/docs/MASTER_BUILD_CHECKLIST.md)
