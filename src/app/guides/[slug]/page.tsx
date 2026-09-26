import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo/config";
import { GUIDE_ARTICLES } from "@/lib/seo/content";
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/schema";
import { BookOpen, Clock, Calendar, ArrowLeft, ShieldCheck, CheckCircle2, HelpCircle, Share2, Sparkles } from "lucide-react";

interface GuideDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_ARTICLES.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: "Guide Not Found — EstateAI Kolkata",
    };
  }

  return {
    title: `${guide.title} — EstateAI Knowledge Hub`,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: `${SITE_CONFIG.domain}/guides/${guide.slug}`,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type: "article",
      publishedTime: guide.publishDate,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
    },
  };
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const guide = GUIDE_ARTICLES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${guide.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const articleSchema = generateArticleSchema({
    title: guide.title,
    description: guide.metaDescription,
    slug: guide.slug,
    publishDate: guide.publishDate,
  });
  const faqSchema = generateFAQSchema(guide.faqs);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-gradient-to-b from-purple-950/20 via-[#111116] to-[#09090b] pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-cyan-400">Guides</Link>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-xs">{guide.title}</span>
          </nav>

          <div className="flex items-center gap-3">
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

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {guide.title}
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            {guide.summary}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-12 space-y-12">
        {/* Key Takeaways Box */}
        <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Key Executive Summary & Takeaways</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {guide.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="text-xs text-zinc-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-3 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-table:border prose-table:border-zinc-800 prose-th:bg-zinc-900 prose-th:text-white prose-td:border-t prose-td:border-zinc-800 prose-td:p-3">
          <div dangerouslySetInnerHTML={{ __html: guide.contentHtml }} />
        </div>

        {/* FAQs */}
        <section className="space-y-6 pt-8 border-t border-zinc-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-4">
            {guide.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#111116] border border-zinc-800 space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </Link>

          <Link
            href={`/ai-chat?q=${encodeURIComponent(`I have a question about ${guide.title}`)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discuss This Topic with AI Advisor</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
