import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/schema";
import { propertyService } from "@/lib/properties/service";
import { formatINR } from "@/lib/utils";
import { 
  Building2, MapPin, Sparkles, ShieldCheck, 
  ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, 
  HelpCircle, Compass, Bed, Bath, Maximize2 
} from "lucide-react";

interface LocalityPageProps {
  params: Promise<{
    locality: string;
  }>;
}

export async function generateMetadata({ params }: LocalityPageProps): Promise<Metadata> {
  const { locality: slug } = await params;
  const locality = SITE_CONFIG.localityList.find((l) => l.slug === slug);

  if (!locality) {
    return {
      title: "Locality Not Found — EstateAI Kolkata",
    };
  }

  const title = `Flats & Properties in ${locality.name}, Kolkata — RERA Verified Listings`;
  const description = `${locality.description} Average price: ${locality.avgPricePerSqFt}/sq.ft. Explore verified 2, 3 & 4 BHK apartments with AI matchmaking.`;

  return {
    title,
    description,
    keywords: locality.keywords,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/kolkata/${locality.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.domain}/kolkata/${locality.slug}`,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocalityPage({ params }: LocalityPageProps) {
  const { locality: slug } = await params;
  const locality = SITE_CONFIG.localityList.find((l) => l.slug === slug);

  if (!locality) {
    notFound();
  }

  const { properties: allProps } = await propertyService.search({ limit: 100 });
  const matchedProperties = allProps.filter((p) => {
    const locLower = locality.name.toLowerCase();
    const pLoc = (p.locality || "").toLowerCase();
    return pLoc.includes(locLower) || locLower.includes(pLoc) || p.address.toLowerCase().includes(locLower);
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Kolkata Properties", url: "/properties/kolkata" },
    { name: locality.name, url: `/kolkata/${locality.slug}` },
  ];

  const faqs = [
    {
      question: `What is the average price per sq.ft for flats in ${locality.name}?`,
      answer: `The average property price in ${locality.name}, Kolkata currently ranges from ${locality.avgPricePerSqFt}/sq.ft depending on builder grade, floor height, and amenities.`,
    },
    {
      question: `Are all properties in ${locality.name} on EstateAI RERA registered?`,
      answer: `Yes, 100% of new projects and developer listings in ${locality.name} featured on EstateAI Kolkata carry validated West Bengal RERA (WBRERA) registration numbers.`,
    },
    {
      question: `How does EstateAI AI match properties in ${locality.name}?`,
      answer: `Our conversational AI evaluates over 20+ variables including your commute to Sector V / Airport, budget brackets, Vastu preferences, and possession timeline to rank the best homes in ${locality.name}.`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero / Header */}
      <header className="relative border-b border-zinc-800 bg-gradient-to-b from-cyan-950/20 via-[#111116] to-[#09090b] pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-cyan-400">Kolkata</Link>
            <span>/</span>
            <span className="text-zinc-200">{locality.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>Kolkata Micro-Market Guide</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Flats & Properties in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{locality.name}</span>
              </h1>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                {locality.description}
              </p>
            </div>

            <div className="bg-[#18181f] border border-zinc-800 p-6 rounded-2xl shrink-0 space-y-3 w-full lg:w-72">
              <div className="text-xs font-mono text-zinc-500 uppercase">Avg Market Rate</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>{locality.avgPricePerSqFt}</span>
              </div>
              <div className="text-xs text-zinc-400">Per Sq.Ft (Carpet / Built-up)</div>
              <div className="pt-2">
                <Link
                  href={`/ai-chat?q=${encodeURIComponent(`Show me top verified flats in ${locality.name}`)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:opacity-95 shadow-lg shadow-cyan-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI for {locality.name} Homes</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Highlights pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {locality.highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content & Listings */}
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-12 space-y-16">
        {/* Listings Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Available Listings in {locality.name}</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Showing {matchedProperties.length} active WBRERA verified inventory
              </p>
            </div>
            <Link
              href={`/properties?location=${encodeURIComponent(locality.name)}`}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono inline-flex items-center gap-1"
            >
              <span>View in search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {matchedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="group bg-[#111116] border border-zinc-800/80 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
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
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-black text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111116] border border-zinc-800 rounded-2xl space-y-4">
              <Compass className="w-8 h-8 text-zinc-600 mx-auto" />
              <div className="text-sm font-semibold text-white">Upcoming Inventory in {locality.name}</div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                We are currently onboarding verified developer projects in this micro-market. Chat with our AI to get early off-market access.
              </p>
              <Link
                href={`/ai-chat?q=${encodeURIComponent(`Notify me when new flats launch in ${locality.name}`)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Early Access</span>
              </Link>
            </div>
          )}
        </section>

        {/* Locality FAQs */}
        <section className="space-y-6 pt-6 border-t border-zinc-800/80">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>Frequently Asked Questions — {locality.name}</span>
            </h2>
            <p className="text-xs text-zinc-400">Everything you need to know about buying property in {locality.name}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#111116] border border-zinc-800 space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Localities Links Matrix */}
        <section className="space-y-4 pt-6 border-t border-zinc-800/80">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">Explore Other Kolkata Localities</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SITE_CONFIG.localityList
              .filter((l) => l.slug !== locality.slug)
              .map((otherLoc) => (
                <Link
                  key={otherLoc.slug}
                  href={`/kolkata/${otherLoc.slug}`}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-xs text-zinc-300 hover:text-cyan-300 font-medium transition-colors"
                >
                  <div>{otherLoc.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{otherLoc.avgPricePerSqFt}</div>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
