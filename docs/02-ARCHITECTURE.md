# 02 — ARCHITECTURE.md

> **Use a modular monolith first; keep boundaries clean enough to extract services later.**

---

## 1. System Architecture

```text
Browser / Mobile Web
|
v
Next.js App Router
|
+--> Public Website / SEO
+--> Customer Experience
+--> Agent Portal
+--> Admin Portal
|
v
Typed API / Server Actions
|
+--> Auth & RBAC
+--> AI Orchestrator
+--> Property Search
+--> Matching Engine
+--> Lead Engine
+--> Visit Scheduler
+--> Notification Engine
+--> Analytics
+--> Commission Engine
|
v
PostgreSQL + PostGIS + Vector Search (pgvector)
|
+--> Object Storage (S3-compatible)
+--> Email / SMS / WhatsApp provider
+--> Maps / Geocoding
+--> LLM provider
```

---

## 2. Architectural Rules
- **Server is the source of truth** for permissions, pricing, lead state, property state, visit state, and commission state.
- **Never trust client-provided** role, ownership, commission, or status fields.
- **Use typed schemas (Zod)** at every API boundary.
- **AI outputs must be validated** before they mutate application state.
- **Keep AI orchestration separate** from business-domain services.
- **Use background jobs/queues** for slow/non-critical work such as embeddings, notifications, and analytics aggregation.
- **Every important state transition** must create an auditable event.

---

## 3. Core Modules & Responsibilities

| Module | Responsibilities |
| :--- | :--- |
| **Identity** | Signup, login, OTP/email/social auth, sessions, account recovery |
| **RBAC** | Customer, agent, owner, developer, admin and scoped permissions |
| **Properties** | CRUD, media, availability, verification, location, amenities |
| **Search** | Filters, geo-radius, sorting, text search, semantic retrieval |
| **AI Agent** | Conversation, intent extraction, requirement memory, tool calling, responses |
| **Matching** | Hard constraints + weighted preference matching + transparent explanations |
| **Leads** | Qualification, scoring, routing, pipeline and attribution |
| **Visits** | Availability, booking, reminders, rescheduling, completion |
| **CRM** | Notes, tasks, contacts, communication history |
| **Revenue** | Commission records, lead fees, featured listings and transaction lifecycle |
| **Admin** | Moderation, verification, configuration, analytics and audit |

---

## 4. Failure Strategy
- **If AI fails**: Fall back to deterministic property filters and a normal contact form.
- **If maps fail**: Show textual locality information and retain coordinates.
- **If notifications fail**: Persist the notification and retry through a job queue.
- **If a property becomes unavailable during a conversation**: Never recommend it as available; re-check availability before visit booking.
