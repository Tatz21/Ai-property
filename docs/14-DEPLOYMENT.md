# 14 — DEPLOYMENT.md

> **Deployment environments, production checklist, CI/CD, and system observability.**

---

## 1. Environments

| Environment | Purpose |
| :--- | :--- |
| **Local** | Local development, unit/integration testing, and seeded database fixtures |
| **Preview / Staging** | Automated PR validation, end-to-end QA, and realistic integration testing |
| **Production** | Real customers, verified agents, live properties, and real financial transactions |

---

## 2. Production Deployment Checklist
- [ ] Configure custom domain, DNS records, and SSL/TLS HTTPS certificates.
- [ ] Provision managed PostgreSQL instance with automated daily backup snapshots.
- [ ] Enable PostGIS and pgvector extensions.
- [ ] Configure production S3-compatible object storage with signed URL access policies.
- [ ] Set up production AI provider API credentials, quotas, and rate-limit alarms.
- [ ] Configure multi-channel notification services (Email/SES/Resend, SMS/Twilio, WhatsApp Business).
- [ ] Configure error tracking (Sentry) and performance telemetry.
- [ ] Configure product analytics and server-side event tracking.
- [ ] Set secure session cookie flags (`HttpOnly`, `Secure`, `SameSite=Lax/Strict`).
- [ ] Enforce strict CORS and origin verification headers.
- [ ] Run latest production database migrations.
- [ ] Run seed scripts exclusively for controlled system reference data (amenities, localities, system roles).
- [ ] Verify `sitemap.xml`, `robots.txt`, and indexable canonical URLs.
- [ ] Verify core authentication, AI assistant, search, visit booking, and admin flows.
- [ ] Enable infrastructure monitoring and operational alert webhooks.

---

## 3. CI/CD Pipeline
```text
1. Install Dependencies (Clean NPM install)
2. Typecheck (tsc --noEmit)
3. Lint (eslint / formatting checks)
4. Unit Tests (vitest run)
5. Build (next build)
6. Integration Tests (run against isolated test DB)
7. E2E Smoke Tests (playwright)
8. Deploy to Preview Environment
9. Production Deployment (triggered upon merge to main + all checks green)
```

---

## 4. Observability & Telemetry
- **Request IDs**: Passed in request headers (`X-Request-Id`) across API boundaries.
- **Structured Server Logs**: JSON-formatted logs with timestamps, level, service name, and error stack traces.
- **AI Telemetry**: Track token usage, prompt versions, latency, and failure rates per provider.
- **Search Latency**: Monitor PostGIS query execution times and pgvector retrieval latency.
- **Business Health**: Monitor visit booking conversion rates, notification delivery failure rates, and background job queues.
