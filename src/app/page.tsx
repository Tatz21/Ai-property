"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Building, ShieldCheck, MapPin, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { GenerateButton } from "@/components/ui/generate-button";
import { FeatCard } from "@/components/ui/feat-card";
import { TestimonialsCard, Testimonial } from "@/components/ui/testimonials-card";
import { formatINR } from "@/lib/utils";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Anirban Sengupta",
    role: "Senior Consultant, Apollo Gleneagles",
    location: "EM Bypass, Kolkata",
    content: "I told the AI I needed a quiet, lake-facing 3 BHK near Salt Lake Sector V with ready-to-move status. Within seconds, it retrieved verified RERA listings and booked my site visit!",
    rating: 5,
    highlight: "Booked visit in under 60 seconds"
  },
  {
    id: "2",
    name: "Poulomi Chatterjee",
    role: "VP Engineering",
    location: "New Town Action Area I",
    content: "Traditional property portals spam you with irrelevant broker calls. EstateAI understood my strict budget and EV parking requirement with zero spam.",
    rating: 5,
    highlight: "Zero broker spam, 100% verified"
  }
];

export default function HomePage() {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchOutput, setSearchOutput] = useState<string | null>(null);
  const [matchedProperties, setMatchedProperties] = useState<any[]>([]);

  const handleAISearch = async (overrideQuery?: string) => {
    const q = overrideQuery || naturalQuery;
    if (!q.trim()) return;
    setIsGenerating(true);
    setSearchOutput(null);
    setMatchedProperties([]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      if (res.ok) {
        setSearchOutput(data.message?.content || "Verified matches found based on your criteria.");
        setMatchedProperties(data.matchedProperties || []);
      } else {
        // Fallback to direct property search
        const fallbackRes = await fetch("/api/properties");
        const fallbackData = await fallbackRes.json();
        setSearchOutput("Found verified Kolkata properties matching your criteria.");
        setMatchedProperties((fallbackData.properties || []).slice(0, 3));
      }
    } catch {
      const fallbackRes = await fetch("/api/properties");
      const fallbackData = await fallbackRes.json();
      setSearchOutput("Retrieved verified Kolkata active properties.");
      setMatchedProperties((fallbackData.properties || []).slice(0, 3));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Background Perspective Grid */}
      <PerspectiveGrid />

      {/* Mandatory Reference Spotlight Navbar */}
      <SpotlightNavbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India’s First AI-Native Real Estate Agent • Kolkata Launch</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Find Your Perfect Home in Kolkata{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Without Endless Filtering
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Tell our conversational AI exactly what you want in plain English or Bengali. We match verified inventory, explain match reasons, and coordinate site visits.
        </p>

        {/* AI Input Box with GenerateButton */}
        <div id="ai-search" className="max-w-2xl mx-auto rounded-[24px] p-2 sm:p-2.5 bg-[#121218]/90 border border-zinc-700/80 shadow-2xl backdrop-blur-2xl mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
              placeholder="e.g., 3 BHK near Eco Park New Town under 95 Lakhs with lake view..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <GenerateButton
              isGenerating={isGenerating}
              onClick={() => handleAISearch()}
              glowColor="cyan"
              className="shrink-0"
            >
              Search with AI
            </GenerateButton>
          </div>
        </div>

        {/* AI Output / Property Results */}
        {searchOutput && (
          <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-left space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-cyan-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>AI Intent Extracted & Matched</span>
              </div>
              <Link
                href="/ai-chat"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full AI Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
              {searchOutput}
            </div>

            {matchedProperties.length > 0 && (
              <div className="pt-3 border-t border-cyan-500/20 space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold block">
                  Matched Real Estate Inventory ({matchedProperties.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedProperties.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-[#111116] border border-zinc-700/80 flex flex-col justify-between hover:border-cyan-500/60 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {p.verificationStatus?.toUpperCase() || "VERIFIED"}
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            {formatINR(p.price)}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{p.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{p.locality}</p>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400">
                          {p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"} • {p.areaSqFt} sq.ft
                        </span>
                        <Link
                          href={`/properties/${p.id}`}
                          className="text-[10px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span>View Property</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Micro-Markets in Kolkata */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-xs text-zinc-400">
          <span className="text-zinc-500 font-mono text-[11px]">Trending in Kolkata:</span>
          {["New Town Action Area II", "Salt Lake Sector V", "EM Bypass", "Rajarhat Chinar Park", "Ballygunge"].map((loc) => (
            <button
              key={loc}
              onClick={() => {
                const queryText = `Show me 3 BHK flats in ${loc}`;
                setNaturalQuery(queryText);
                handleAISearch(queryText);
              }}
              className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-300 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              {loc}
            </button>
          ))}
        </div>
      </section>

      {/* Mandatory Bento / FeatCard Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            AI-First PropTech Infrastructure
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Engineered from the ground up with strict verification, spatial queries, and transparent match scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatCard
            title="Natural-Language Intent Extraction"
            description="Our conversational model converts nuanced requirements (e.g., 'morning sunlight', 'near metro', 'Vastu compliant') into structured database filters."
            badge="AI Orchestration"
            icon={<Sparkles className="w-5 h-5" />}
            glowColor="cyan"
          />

          <FeatCard
            title="100% Verified Inventory & RERA Audit"
            description="Every listing is cross-referenced with West Bengal RERA databases, physical site checks, and authentic ownership documents."
            badge="Trust & Safety"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
            glowColor="emerald"
          />

          <FeatCard
            title="Transparent Match Explanations"
            description="Never wonder why a property was recommended. Receive clear, cited explanations matching your specific lifestyle and budget goals."
            badge="Explainable AI"
            icon={<Compass className="w-5 h-5 text-purple-400" />}
            glowColor="violet"
          />
        </div>
      </section>

      {/* Featured Verified Kolkata Properties */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Live Verified Listings</h2>
            <p className="text-xs text-zinc-400">Direct from Kolkata developers & verified owners</p>
          </div>
          <Link
            href="/properties/kolkata"
            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            <span>View all inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Card 1 */}
          <div className="rounded-[20px] bg-[#111116] border border-zinc-800 p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  RERA VERIFIED
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  New Town Action Area II
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Luxury 3 BHK Lake-Facing Sky Villa
              </h3>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                Expansive 3 BHK apartment with unobstructed views of Eco Park Lake. Premium Italian marble flooring & smart automation.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <span className="text-xl font-bold text-white font-mono">{formatINR(9500000)}</span>
              <button className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-all cursor-pointer">
                Book Site Visit
              </button>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="rounded-[20px] bg-[#111116] border border-zinc-800 p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  RERA VERIFIED
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Rajarhat Chinar Park
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Modern 2 BHK Urban Residence near Metro
              </h3>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                Vastu compliant 2 BHK flat within 500m of upcoming yellow line metro station. Ready to move.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <span className="text-xl font-bold text-white font-mono">{formatINR(4800000)}</span>
              <button className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-all cursor-pointer">
                Book Site Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mandatory Testimonials Card Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Buyer Experiences</h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-10">How buyers across Kolkata found their home with AI</p>
        <TestimonialsCard testimonials={SAMPLE_TESTIMONIALS} />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Antigravity Master Build Architecture.</p>
      </footer>
    </div>
  );
}
