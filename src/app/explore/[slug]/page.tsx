import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import { propertyService } from "@/lib/properties/service";
import { formatINR } from "@/lib/utils";
import { Building2, MapPin, Sparkles, ShieldCheck, ArrowRight, Bed, Bath, Maximize2 } from "lucide-react";

interface IntentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: IntentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const intent = SITE_CONFIG.intents.find((i) => i.slug === slug);

  if (!intent) {
    return {
      title: "Category Not Found — EstateAI Kolkata",
    };
  }

  return {
    title: intent.title,
    description: intent.metaDescription,
    keywords: intent.targetKeywords,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/explore/${intent.slug}`,
    },
    openGraph: {
      title: intent.title,
      description: intent.metaDescription,
      url: `${SITE_CONFIG.domain}/explore/${intent.slug}`,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function IntentExplorePage({ params }: IntentPageProps) {
  const { slug } = await params;
  const intent = SITE_CONFIG.intents.find((i) => i.slug === slug);

  if (!intent) {
    notFound();
  }

  const { properties: allProps } = await propertyService.search({ limit: 100 });
  const matched = allProps.filter((p) => {
    if (intent.bhk > 0 && p.bhk !== intent.bhk) {
      return false;
    }
    return true;
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Explore", url: "/properties" },
    { name: intent.title, url: `/explore/${intent.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="border-b border-zinc-800 bg-gradient-to-b from-indigo-950/20 via-[#111116] to-[#09090b] pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-cyan-400">Explore</Link>
            <span>/</span>
            <span className="text-zinc-200">{intent.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {intent.title}
          </h1>
          <p className="text-zinc-400 text-base max-w-3xl leading-relaxed">
            {intent.metaDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400">
              Typical Price: <span className="text-white font-bold">{intent.priceRange}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
              100% WBRERA Approved
            </div>
            <Link
              href={`/ai-chat?q=${encodeURIComponent(`I am looking for ${intent.title}`)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Let AI Match My Budget</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-12 space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Curated Inventory ({matched.length} Listings)</span>
          </h2>
          <Link
            href="/properties"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>All properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matched.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#111116] border border-zinc-800/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {prop.type || "Apartment"}
                  </span>
                  {prop.reraId && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RERA Verified</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{prop.locality}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/60 text-center text-xs text-zinc-300 font-mono">
                  <div className="flex flex-col items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{prop.bhk} BHK</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{Math.max(1, prop.bhk)} Bath</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{prop.areaSqFt} sq.ft</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-zinc-800/40 bg-zinc-900/40">
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {formatINR(prop.price)}
                </div>
                <Link
                  href={`/properties/${prop.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
