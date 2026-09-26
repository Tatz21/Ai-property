import { SITE_CONFIG } from "./config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_CONFIG.domain}${item.url}`
    }))
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateRealEstateListingSchema(property: {
  id: string;
  title: string;
  description: string;
  price: number;
  locality?: string;
  location?: string;
  address?: string;
  bhk?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  carpetAreaSqFt?: number;
  images?: string[];
  media?: { url: string }[];
  reraId?: string;
  possessionDate?: string;
}) {
  const images = property.images || (property.media ? property.media.map(m => m.url) : []);
  const bhkVal = property.bhk ?? property.bedrooms ?? 2;
  const areaVal = property.areaSqFt ?? property.carpetAreaSqFt ?? 1000;
  const locVal = property.locality || property.location || property.address || "Kolkata";
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `${SITE_CONFIG.domain}/properties/${property.id}`,
    "image": images.length > 0 ? images : [`${SITE_CONFIG.domain}/images/property-placeholder.jpg`],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split("T")[0]
    },
    "containedInPlace": {
      "@type": "Place",
      "name": locVal,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": locVal,
        "addressRegion": "West Bengal",
        "addressCountry": "IN"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Bedrooms",
        "value": `${bhkVal} BHK`
      },
      {
        "@type": "PropertyValue",
        "name": "Carpet Area",
        "value": `${areaVal} sq.ft.`
      },
      {
        "@type": "PropertyValue",
        "name": "RERA Registration ID",
        "value": property.reraId || "WBRERA Registered"
      }
    ]
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "url": `${SITE_CONFIG.domain}/guides/${article.slug}`,
    "datePublished": article.publishDate,
    "dateModified": article.publishDate,
    "author": {
      "@type": "Organization",
      "name": article.author || SITE_CONFIG.author,
      "url": SITE_CONFIG.domain
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.domain}/icon.png`
      }
    }
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": SITE_CONFIG.name,
    "legalName": SITE_CONFIG.legalName,
    "url": SITE_CONFIG.domain,
    "logo": `${SITE_CONFIG.domain}/icon.png`,
    "description": SITE_CONFIG.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sector V, Salt Lake City",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700091",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.5868",
      "longitude": "88.4178"
    },
    "telephone": "+91-33-4050-8000",
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "₹₹₹"
  };
}
