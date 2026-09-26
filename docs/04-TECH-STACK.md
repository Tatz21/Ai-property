# 04 — TECH-STACK.md

> **Production stack configuration, dependencies, and environment variables.**

---

## 1. Recommended Production Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js App Router + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui + custom CSS for reference components |
| **Motion** | Framer Motion |
| **Icons** | Lucide + Phosphor Icons |
| **Backend** | Next.js server routes/server actions or separate TypeScript API layer |
| **Database** | PostgreSQL |
| **Geo** | PostGIS |
| **ORM** | Prisma or Drizzle |
| **Validation** | Zod |
| **AI** | LLM provider with tool/function calling and structured outputs |
| **Vector Search** | pgvector |
| **Storage** | S3-compatible object storage |
| **Auth** | Secure session-based auth + OTP/email/social provider |
| **Maps** | Geocoding / Maps provider |
| **Notifications** | Email + SMS + WhatsApp provider + web push |
| **Jobs** | Queue/worker system for retries and async tasks |
| **Analytics** | Product analytics + server-side event tracking |
| **Testing** | Vitest / Jest + Playwright |
| **Deployment** | Vercel / Node runtime + managed PostgreSQL + object storage |

---

## 2. Environment Variables Specification

```env
# Database
DATABASE_URL=
DIRECT_DATABASE_URL=

# Auth
AUTH_SECRET=

# AI & LLM Engine
AI_API_KEY=
AI_MODEL=

# Object Storage (S3 / Cloud Storage)
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

# Maps & Geocoding
MAPS_API_KEY=

# Notifications & Messaging
WHATSAPP_API_KEY=
SMS_API_KEY=
EMAIL_API_KEY=

# App URLs & Observability
NEXT_PUBLIC_APP_URL=
SENTRY_DSN=
```

> [!WARNING]
> **Security Guardrail**: Do not expose server-only secrets through `NEXT_PUBLIC_*` variables.
