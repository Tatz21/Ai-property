import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/properties",
          "/properties/*",
          "/kolkata/*",
          "/explore/*",
          "/guides",
          "/guides/*",
          "/ai-chat",
          "/properties/compare",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/agent",
          "/agent/*",
          "/customer",
          "/customer/*",
          "/developer",
          "/developer/*",
          "/owner",
          "/owner/*",
          "/api/auth/*",
          "/api/admin/*",
          "/api/agent/*",
          "/api/customer/*",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
