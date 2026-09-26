import React from "react";
import Link from "next/link";
import { Compass, Sparkles, MapPin, Building2, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">404 — Property or Page Not Found</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Looking for something specific in Kolkata?
          </h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            The page you requested may have moved or been delisted. Explore our verified micro-markets or search via AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/properties"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-colors inline-flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Browse All Properties</span>
          </Link>
          <Link
            href="/ai-chat"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Search with AI Assistant</span>
          </Link>
        </div>

        {/* Micro-markets quick links */}
        <div className="pt-8 border-t border-zinc-800/80 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Popular Micro-Markets
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {SITE_CONFIG.localityList.map((loc) => (
              <Link
                key={loc.slug}
                href={`/kolkata/${loc.slug}`}
                className="px-3 py-1.5 rounded-lg bg-[#111116] border border-zinc-800 text-xs text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
