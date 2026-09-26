# 10 — SECURITY.md

> **Security, Trust, and Data Protection protocols across identity, API, database, and AI systems.**

---

## 1. Identity & Access Control
- **Secure Sessions**: Token rotation, sliding expiration, and HTTP-only, secure, SameSite cookies.
- **Brute-Force Defense**: Rate limiting and lockout policies on OTP requests and login attempts.
- **Server-Side RBAC**: Granular permission checks at the handler/server action layer.
- **Object-Level Authorization**: Verify owner, assigned agent, or administrative privileges before returning or mutating any entity (property, lead, conversation, document).
- **MFA / Step-Up Auth**: Multi-factor or step-up authentication for administrative actions.

---

## 2. Data Security & Privacy
- **Encryption**: TLS in transit (HTTPS/WSS) and encryption at rest across database and object stores.
- **Signed Storage URLs**: Never expose private document buckets or sensitive identification assets; issue short-lived signed URLs.
- **PII Protection**: Minimize storage of unnecessary personal data; mask phone numbers and emails in unauthorized views.
- **Retention & Deletion**: Implement verifiable data deletion workflows conforming to data protection laws.

---

## 3. Application & Infrastructure Security
- **Strict Input Validation**: Zod parsing on 100% of mutation boundaries.
- **Content Sanitization**: Escape user and agent inputs to prevent Cross-Site Scripting (XSS).
- **CSRF & Origin Protections**: Enforce origin matching and anti-CSRF headers.
- **Upload Hardening**: Strict MIME-type checking, magic byte inspection, maximum file size caps, and virus scanning.
- **Audit Logging**: Immutable logging for all sensitive, financial, and administrative operations.

---

## 4. AI Security & Guardrails
- **Untrusted User Inputs**: Treat all customer prompts and third-party listing text as untrusted.
- **Prompt Injection Defense**: Prevent user input from overriding developer/system instructions or leaking system prompts.
- **Tool Execution Authorizations**: AI tool calls execute through the same authorization and validation pipeline as user APIs.
- **Zero Arbitrary Mutation**: LLMs cannot execute raw SQL or unvalidated arbitrary mutations; all mutations pass through typed, validated services.
- **Secret Isolation**: Never pass private API keys, user passwords, or backend secrets into LLM prompts or client payloads.

---

## 5. Real Estate Trust & Compliance
- **Verification Integrity**: Strictly distinguish platform-verified information from self-reported owner/agent listings.
- **Legal Compliance**: Explicitly declare that platform checks do not substitute for formal legal title verification.
- **No Hallucinated Data**: Never allow AI to invent RERA registration IDs, pricing, square footage, amenities, or possession dates.
- **Live Inventory Guard**: Re-validate listing status and price prior to confirming site visits or booking commitments.
