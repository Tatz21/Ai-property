# 01 — PRD.md

> **This is the product contract. Build the complete system, not a marketing shell.**

---

## 1. Product Vision
Create an AI-powered property agent that understands natural-language property requirements, searches verified inventory, explains matches, qualifies leads, coordinates site visits and hands high-intent prospects to human property specialists.

---

## 2. Core Value Proposition
- **Buyer**: Tell the AI what you want instead of manually filtering hundreds of listings.
- **Agent**: Receive structured, qualified leads with the complete AI conversation and buyer intent.
- **Owner/Developer**: Receive relevant demand and measurable listing performance.
- **Platform**: Monetize through qualified leads, brokerage/commission and optional premium listing services.

---

## 3. Product Surfaces

| Surface | Required Capabilities |
| :--- | :--- |
| **Public Website** | SEO pages, landing page, locality pages, property discovery, AI entry point, trust/verification content |
| **Customer App/Web** | AI chat, profile, requirements, search, recommendations, shortlist, compare, visits, notifications |
| **Agent Portal** | Leads, properties, AI conversation context, follow-ups, visits, pipeline, commission tracking |
| **Owner Portal** | Listings, inquiries, visits, performance, documents, availability |
| **Developer Portal** | Projects, inventory, pricing, leads, campaign/listing analytics |
| **Admin** | Users, properties, verification, agents, leads, assignments, commissions, AI, SEO, audit logs, settings |
| **Backend** | Auth, RBAC, property engine, AI orchestration, matching, lead scoring, notifications, scheduling, analytics, payments/commission records |

---

## 4. MVP Acceptance Criteria
- A customer can enter a natural-language property request and receive structured requirements.
- The AI can query the property database and return matching properties.
- The customer can view details, shortlist and request a visit.
- The platform creates a qualified lead and assigns it to an eligible agent.
- The agent sees the full AI conversation, requirements, shortlisted properties and visit request.
- Admin can manage users, properties, agents, verification, leads and assignments.
- All critical actions are persisted server-side and protected by authorization.
- The public site is crawlable, responsive and SEO-ready.

---

## 5. Non-goals for MVP
- Do not build a full legal/title verification service.
- Do not promise property investment returns or guaranteed appreciation.
- Do not allow AI to make binding legal, lending or financial decisions.
- Do not build complex automated negotiation in MVP.
- Do not launch nationwide inventory before the data and operations workflow is reliable.
