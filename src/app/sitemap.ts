import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { GUIDE_ARTICLES } from "@/lib/seo/content";
import { propertyService } from "@/lib/properties/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/properties/kolkata`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-chat`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Locality Pages
  const localityRoutes: MetadataRoute.Sitemap = SITE_CONFIG.localityList.map((loc) => ({
    url: `${baseUrl}/kolkata/${loc.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Programmatic Intent Pages
  const intentRoutes: MetadataRoute.Sitemap = SITE_CONFIG.intents.map((intent) => ({
    url: `${baseUrl}/explore/${intent.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 4. Knowledge Base & Guides
  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ARTICLES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishDate),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // 5. Dynamic Property Listings
  const searchResult = await propertyService.search({ limit: 200 });
  const propertyRoutes: MetadataRoute.Sitemap = (searchResult.properties || [])
    .filter((p) => p.status === "available" || p.verificationStatus === "verified")
    .map((p) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: new Date(p.updatedAt || p.createdAt || now),
      changeFrequency: "daily",
      priority: 0.9,
    }));

  return [
    ...staticRoutes,
    ...localityRoutes,
    ...intentRoutes,
    ...guideRoutes,
    ...propertyRoutes,
  ];
}
