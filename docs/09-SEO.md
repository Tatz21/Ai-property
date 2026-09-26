# 09 — SEO.md

> **SEO is a core product subsystem, not a final marketing afterthought.**

---

## 1. Public SEO Architecture
- **Home Page**: High-authority landing hub showcasing AI discovery capabilities and top micro-markets.
- **City Pages**: Regional hubs (e.g. Kolkata, Salt Lake, New Town).
- **Locality Pages**: Deep micro-market intelligence (e.g. New Town Action Area I/II/III, EM Bypass, Rajarhat, Alipore).
- **Property-Type + Locality Pages**: High-intent long-tail discovery pages.
- **Budget-Intent Pages**: Structured price brackets based on regional search patterns.
- **Transit & Landmark Pages**: Near-metro and near-IT park landing pages.
- **Guides & Educational Knowledge Base**: Home loan calculators, RERA verification guides, registration tax breakdowns.
- **Individual Property Pages**: Crawlable, canonical indexable pages for verified listings.

---

## 2. Example Programmatic Routes
```text
/properties
/properties/kolkata
/properties/kolkata/new-town
/2-bhk-flats-in-new-town
/2-bhk-flats-under-70-lakh-kolkata
/flats-near-new-town-metro
/commercial-office-space-salt-lake
/guides/home-loan
/guides/rera
/guides/property-registration
```

---

## 3. On-Page SEO Requirements
- **Meta Tags**: Dynamic, unique `<title>` and `<meta name="description">` tags.
- **Canonical URLs**: Strict canonical link headers on all indexable pages.
- **Social Sharing**: OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter/X Cards.
- **Structured Data (JSON-LD)**:
  - `BreadcrumbList` schema across hierarchical routes.
  - `RealEstateListing` / `SingleFamilyResidence` schema for individual properties.
  - `Organization` / `LocalBusiness` schema for agency trust.
  - `FAQPage` schema on guides with authentic FAQs.
- **Image Optimization**: Descriptive alt tags, WebP/AVIF formatting, responsive `srcset`.
- **Internal Linking Matrix**: Interlinked city, locality, property, and educational guide networks.
- **Sitemaps & Robots**: Automated dynamic `sitemap.xml` and validated `robots.txt`.
- **Core Web Vitals**: Optimized LCP, INP, and CLS scores with zero render-blocking waterfalls.

---

## 4. SEO Content Integrity Rule
> [!IMPORTANT]
> **AI-generated locality and property content must never be published blindly.** It must rely on structured database source attributes, strictly avoid fabricated statistics or fake landmarks, expose clear data freshness timestamps, and support manual editorial/admin review.
