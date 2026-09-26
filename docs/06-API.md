# 06 — API.md

> **All APIs must be typed, authenticated where required, validated, and authorization-checked server-side.**

---

## 1. Authentication Endpoints
```http
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/otp/request
POST /api/auth/otp/verify
POST /api/auth/logout
GET  /api/auth/session
```

---

## 2. AI Agent Endpoints
```http
POST /api/ai/chat
POST /api/ai/requirements/extract
POST /api/ai/properties/match
POST /api/ai/shortlist/generate
POST /api/ai/compare
POST /api/ai/followup/generate
```

---

## 3. Properties Endpoints
```http
GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PATCH  /api/properties/:id
DELETE /api/properties/:id
POST   /api/properties/:id/media
POST   /api/properties/:id/verify
POST   /api/properties/:id/report
```

---

## 4. Leads & Site Visits Endpoints
```http
GET   /api/leads
POST  /api/leads
GET   /api/leads/:id
PATCH /api/leads/:id
POST  /api/leads/:id/assign

POST  /api/visits
GET   /api/visits
PATCH /api/visits/:id
POST  /api/visits/:id/cancel
```

---

## 5. Admin Endpoints
```http
GET/PATCH /api/admin/users
GET/PATCH /api/admin/properties
GET/PATCH /api/admin/leads
GET/PATCH /api/admin/agents
GET/PATCH /api/admin/verifications
GET       /api/admin/audit-logs
GET/PATCH /api/admin/settings
```

---

## 6. API Rules & Security Protocols
- **Validation**: Every mutation must strictly validate input payloads with Zod schemas.
- **RBAC & Authorization**: Every protected endpoint checks session validity and role/ownership permissions server-side.
- **Rate Limiting**: Aggressive rate-limiting on authentication, OTP, and AI/LLM endpoints.
- **Idempotency**: Use idempotency keys for visit booking, lead generation, and financial/commission mutations.
- **Error Envelopes**: Return consistent, typed JSON error envelopes `{ error: { code, message, details } }`.
- **Privacy**: Never return private owner/agent/customer PII to unauthorized users.
- **Correlation & Logs**: Log structured Request IDs for debugging and audit trail correlation.
