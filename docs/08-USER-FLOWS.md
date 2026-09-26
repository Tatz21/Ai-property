# 08 — USER-FLOWS.md

> **Detailed sequential user and operational flows across the platform.**

---

## Flow A — Buyer Discovery
```text
Landing Page
    │
    ▼
Start AI Search / Input Requirements
    │
    ▼
Natural Language AI Conversation (Requirements Extracted & Synced)
    │
    ▼
Execute Hybrid Search (PostGIS + Vector + Deterministic Filters)
    │
    ▼
Review Matching Results with Transparent Explanations
    │
    ▼
Inspect Property Details (Media, Verified Badges, Locality, Amenities)
    │
    ▼
Shortlist / Compare Selected Properties
    │
    ▼
Contact Specialist OR Schedule Site Visit
    │
    ▼
Lead Created in System ──▶ Local Agent Assigned & Notified
```

---

## Flow B — High-Intent Lead Pipeline
```text
AI Detects High Intent in Customer Chat
    │
    ▼
Validate & Score Lead Server-Side (Source, Intent Score, Criteria)
    │
    ▼
Persist Lead & Trigger Routing Engine (Geo-locality & Specialty Match)
    │
    ▼
Assign Eligible Agent & Send Instant Multi-Channel Notification
    │
    ▼
Agent Opens Lead Console (Inspects Full AI Transcript & Requirements)
    │
    ▼
Direct Customer Contact ──▶ Schedule Site Visit ──▶ Log CRM Follow-Up
    │
    ▼
Deal Negotiation ──▶ Transaction Recorded ──▶ Commission Ledger Entry
```

---

## Flow C — Property Listing & Publishing
```text
Owner / Agent Authenticates
    │
    ▼
Initiate "Add Property" Flow
    │
    ▼
Input Property Specifics (Title, BHK, Price, Area, Furnishing)
    │
    ▼
Set Geocoded Location & Micro-Market Details
    │
    ▼
Upload Verified Media (Images, Floor Plans, Video Tours)
    │
    ▼
Upload Compliance Documents (Title Deed, Tax Receipt, RERA Certificate)
    │
    ▼
Submit Listing for Platform Review
    │
    ▼
Automated Checks + Admin Verification Queue
    │
    ▼
Status Updated to "Approved & Published"
    │
    ▼
Generate Vector Embeddings & Index in Search Engine
```

---

## Flow D — Visit Booking & Verification
```text
Customer Selects Property & Requests Visit
    │
    ▼
Server Revalidates Property Live Availability
    │
    ▼
Customer Selects Date & Available Agent Time Slot
    │
    ▼
System Generates Idempotent Booking Record
    │
    ▼
Agent Receives Calendar Invite & Notification
    │
    ▼
Customer Receives Instant Confirmation & SMS/WhatsApp Notification
    │
    ▼
Automated Pre-Visit Reminders (T-24h, T-2h)
    │
    ▼
Visit Outcome Logged (Completed / Rescheduled / No-Show / Cancelled)
    │
    ▼
Analytics & Audit Event Recorded
```

---

## Flow E — Admin Property & Document Verification
```text
1. Open Admin Verification Queue.
2. Review property identity, owner/agent relationship, and uploaded documents.
3. Validate RERA registration number and municipal sanctions where applicable.
4. Record structured verification checks and evidence notes.
5. Approve, Reject, or Request Changes with actionable feedback.
6. Persist signed audit event in `audit_logs`.
7. Approved properties unlock the official platform "Verified" trust badge and public search indexing.
```
