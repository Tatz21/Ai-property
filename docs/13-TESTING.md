# 13 — TESTING.md

> **Testing Pyramid, Critical Scenarios, and Definition of Done.**

---

## 1. Test Pyramid

| Level | Scope |
| :--- | :--- |
| **Unit** | Matching rules, scoring calculations, Zod validation schemas, RBAC permission evaluators, commission calculations, utility functions |
| **Integration** | API + DB transactions + auth sessions + property search + AI tool boundaries |
| **E2E** | Customer discovery, agent lead handling, admin moderation, visit booking |
| **Visual** | Responsive layouts, dark/light themes, component states, and major public pages |
| **Security** | Authorization bypass attempts, rate limits, upload validation, prompt injection, tool abuse |
| **Performance** | Search latency, AI streaming response handling, page load times, image optimization, DB indexes |

---

## 2. Critical E2E Scenarios
1. **Scenario 1**: Customer signs up ➔ describes natural language requirements in AI chat ➔ receives real matching database properties with explanations.
2. **Scenario 2**: Customer shortlists property ➔ requests site visit ➔ agent receives instant notification & calendar invite.
3. **Scenario 3**: Agent opens lead console ➔ inspects AI transcript & structured requirements ➔ advances lead stage.
4. **Scenario 4**: Admin approves pending listing in moderation queue ➔ property becomes publicly searchable with verified trust badge.
5. **Scenario 5**: Property marked unavailable ➔ subsequent visit booking attempts are rejected safely with clear user messaging.
6. **Scenario 6**: Unauthorized user attempts to query another user’s lead or private document ➔ request is strictly denied (403 Forbidden).
7. **Scenario 7**: AI returns malformed JSON or invalid tool arguments ➔ server validates, rejects hallucination, and falls back gracefully to deterministic search.
8. **Scenario 8**: Owner uploads invalid file format or oversized file ➔ upload is rejected with validation error.
9. **Scenario 9**: Admin updates commission configuration ➔ new transactions compute according to the latest active version.
10. **Scenario 10**: SEO crawler requests dynamic locality route ➔ server responds with valid status 200, correct OpenGraph metadata, canonical URL, and JSON-LD schema.

---

## 3. Definition of Done (DoD)
- [ ] Feature functions seamlessly on mobile, tablet, and desktop viewports.
- [ ] Loading, empty, error, and success states exist and are visually polished.
- [ ] API endpoints are strictly validated (Zod) and authorized server-side.
- [ ] Database migration and entity relationships exist.
- [ ] Automated tests cover critical business logic.
- [ ] Audit event is recorded for sensitive/financial state changes.
- [ ] Zero TypeScript, lint, or console errors.
- [ ] Zero fake buttons or mock production data paths.
- [ ] Passes accessibility (a11y) checks.
- [ ] Documentation is updated in `/docs`.
