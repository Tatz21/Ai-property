import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { GUIDE_ARTICLES } from "@/lib/seo/content";
import { BookOpen, Clock, Calendar, ArrowRight, ShieldCheck, Scale, Calculator, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Kolkata Real Estate Knowledge Base & Buyer Guides — EstateAI",
  description: "Comprehensive guides on West Bengal RERA rules, home loan interest rates, stamp duty calculations, and micro-market analysis in Kolkata.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/guides`,
  },
};

export default function GuidesHubPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-gradient-to-b from-purple-950/20 via-[#111116] to-[#09090b] pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buyer Education & Regulatory Knowledge Hub</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Kolkata Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Guides & Insights</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-3xl leading-relaxed">
            Empowering property buyers, investors, and NRIs with transparent regulatory breakdowns, tax optimization frameworks, and micro-market intelligence.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% WBRERA Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Legal Due Diligence</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Tax & Stamp Duty Slabs</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid of Guides */}
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GUIDE_ARTICLES.map((guide) => (
            <article
              key={guide.slug}
              className="group bg-[#111116] border border-zinc-800/80 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/20"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {guide.publishDate}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                  <Link href={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h2>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {guide.summary}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase">Key Takeaways:</div>
                  <ul className="space-y-1.5">
                    {guide.keyTakeaways.slice(0, 2).map((point, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {guide.keywords.slice(0, 2).map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors"
                >
                  <span>Read full guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* AI Assistant Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-zinc-900 border border-purple-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Have a specific legal or loan question?</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Our AI property advisor is trained on West Bengal municipal rules, RERA acts, and bank interest policies.
            </p>
          </div>
          <Link
            href="/ai-chat"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 whitespace-nowrap"
          >
            Ask EstateAI Assistant
          </Link>
        </div>
      </main>
    </div>
  );
}
