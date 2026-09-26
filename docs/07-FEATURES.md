# 07 — FEATURES.md

> **Comprehensive feature matrix categorized by user surface and system capability.**

---

## 1. Customer / Buyer
- **AI Property Conversation**: Natural conversational interface with persistent requirement context memory.
- **Search & Discovery**: Natural-language search coupled with deterministic faceted filters (price, BHK, locality, ready-to-move, verified).
- **Personalized Property Matching**: Transparent match scoring and plain-English match reasoning.
- **Rich Property Details**: High-resolution media, interactive maps, verified amenities, verification badge state, and real-time availability.
- **Shortlist & Comparison**: Persistent shortlist and side-by-side multi-property comparison matrix.
- **Agent Contact & Handoff**: Seamless high-intent handoff to dedicated local human specialists.
- **Site Visit Management**: Direct booking, rescheduling, and cancellation of site visits with agent calendar synchronization.
- **Notifications & Saved Searches**: Alerts on price changes, newly matching listings, and visit reminders.
- **Profile Management**: Custom buyer preferences, financing plans, and property criteria.

---

## 2. Agent Portal
- **Lead Inbox**: Organized by intent level, match urgency, and pipeline stage.
- **AI Context & Transcripts**: Access to full buyer conversational history, extracted requirement JSON, and matched properties.
- **Inventory Management**: Property assignment, unit availability controls, and featured statuses.
- **Lead Assignment & Reassignment**: Operational routing rules and manual override handoffs.
- **CRM Tools**: Follow-up reminders, structured notes, and contact history.
- **Visit Calendar**: Interactive scheduling with confirmation tracking and status triggers.
- **Commission Pipeline**: Real-time commission ledger, deal progress tracking, and payout transparency.

---

## 3. Owner / Developer Portal
- **Listing & Project Management**: Multi-unit/project creation, configuration, and phase management.
- **Inventory & Unit Control**: Pricing updates, floor plans, and real-time unit status toggle.
- **Lead & Inquiry Visibility**: Aggregated buyer interest and visit request logs.
- **Performance Analytics**: Listing views, click-through rates, shortlist counts, and conversion metrics.
- **Document & Verification Workflow**: Title deeds, RERA filings, and sanction plan uploads with automated/admin audit status.

---

## 4. Admin Management Surface
- **Global Dashboard**: Platform-wide health, active visits, pending verifications, and financial performance.
- **User & Role Administration**: Granular RBAC controls across customers, agents, owners, and developers.
- **Moderation & Trust**: Property verification queues and fraud mitigation checks.
- **Agent Onboarding**: Service-area mapping, specialty configuration, and capacity management.
- **Lead Routing Rules**: Configurable weighted allocation algorithms.
- **AI Configuration**: Prompt version management, LLM model selection, temperature tuning, and fallback thresholds.
- **SEO & Content CMS**: Locality page generator and guide publisher.
- **Financial Controls**: Commission tiers, revenue reconciliations, and audit log inspection.

---

## 5. AI Capabilities
- **Intent Classification**: Distinguishes between browsing, high-intent buying, visit requests, and price inquiries.
- **Requirement Extraction**: Parses unstructured input into structured schemas (budget, BHK, micro-market, amenities).
- **Hybrid Retrieval**: Combines semantic vector similarity with deterministic PostGIS/SQL constraints.
- **Match Explanation**: Synthesizes custom explanations detailing why specific units match buyer criteria.
- **Tool Calling**: Autonomous invocation of property queries, availability checks, and booking primitives.
- **Human Escalation**: Graceful transition to human property advisors when ambiguity or high intent is detected.
- **Safe Fallback**: Guaranteed deterministic failover when LLM services encounter latency or error states.
