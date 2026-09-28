"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Scale, Check, X, ShieldCheck, MapPin, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { formatINR } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const [comparison, setComparison] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDemoComparison = async (ids: string[]) => {
    try {
      setLoading(true);
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyIds: ids }),
      });
      const data = await res.json();
      if (res.ok && data.comparison) {
        setComparison(data.comparison);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadComparison() {
      if (!idsParam) {
        // Default demo comparison if no IDs provided
        loadDemoComparison(["prop-kol-001", "prop-kol-002", "prop-kol-003"]);
        return;
      }

      const propertyIds = idsParam.split(",").filter(Boolean);
      if (propertyIds.length < 2) {
        setError("Please select at least 2 properties to generate a side-by-side comparison matrix.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyIds }),
        });
        const data = await res.json();
        if (res.ok && data.comparison) {
          setComparison(data.comparison);
        } else {
          setError(data.error?.message || "Failed to compare properties");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadComparison();
  }, [idsParam]);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-zinc-500">
        Computing comparative matrix and amenities overlap...
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-8">
        <Scale className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Comparison Unavailable</h2>
        <p className="text-xs text-zinc-400 mb-6">{error || "Select properties to begin comparison"}</p>
        <Link href="/properties" className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold">
          Browse Kolkata Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Comparison Matrix Table */}
      <div className="rounded-[24px] bg-[#111116] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 border-collapse">
            {/* Header: Property Card Previews */}
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80">
                <th className="p-5 w-48 text-zinc-400 font-mono text-[11px] uppercase tracking-wider bg-[#0d0d12]">
                  Property Overview
                </th>
                {comparison.properties.map((p: any) => (
                  <th key={p.id} className="p-5 min-w-[220px] max-w-[280px] align-top">
                    <div className="rounded-xl overflow-hidden h-28 bg-zinc-900 mb-3 border border-zinc-800">
                      {p.media ? (
                        <img src={p.media} alt={p.title} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">{p.title}</h4>
                    <p className="text-[11px] text-zinc-400 truncate mb-3">{p.locality}</p>
                    <div className="text-base font-extrabold text-cyan-300 font-mono mb-3">
                      {formatINR(p.price)}
                    </div>
                    <Link
                      href={`/properties/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[11px] transition-colors"
                    >
                      <span>Inspect Property</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/80 font-mono text-xs">
              {/* Price / Sq Ft */}
              <tr className="hover:bg-zinc-800/20">
                <td className="p-4 font-bold text-white bg-[#0d0d12]">Rate (₹ / sq.ft)</td>
                {comparison.properties.map((p: any) => (
                  <td key={p.id} className="p-4">
                    <span className={p.id === comparison.bestPricePerSqFt ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                      ₹{p.pricePerSqFt.toLocaleString("en-IN")} / sq.ft
                      {p.id === comparison.bestPricePerSqFt && (
                        <span className="block text-[9px] text-emerald-400 font-normal mt-0.5">★ Best Price/SqFt</span>
                      )}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Built-up Area */}
              <tr className="hover:bg-zinc-800/20">
                <td className="p-4 font-bold text-white bg-[#0d0d12]">Super Built-up Area</td>
                {comparison.properties.map((p: any) => (
                  <td key={p.id} className="p-4">
                    <span className={p.id === comparison.largestArea ? "text-cyan-300 font-bold" : "text-zinc-300"}>
                      {p.areaSqFt} sq.ft
                      {p.id === comparison.largestArea && (
                        <span className="block text-[9px] text-cyan-400 font-normal mt-0.5">★ Largest Layout</span>
                      )}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Configuration */}
              <tr className="hover:bg-zinc-800/20">
                <td className="p-4 font-bold text-white bg-[#0d0d12]">Bedrooms (BHK)</td>
                {comparison.properties.map((p: any) => (
                  <td key={p.id} className="p-4 text-white">
                    {p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"}
                  </td>
                ))}
              </tr>

              {/* Possession Date */}
              <tr className="hover:bg-zinc-800/20">
                <td className="p-4 font-bold text-white bg-[#0d0d12]">Possession Timeline</td>
                {comparison.properties.map((p: any) => (
                  <td key={p.id} className="p-4 text-zinc-300">
                    {p.possessionDate}
                  </td>
                ))}
              </tr>

              {/* WB RERA ID */}
              <tr className="hover:bg-zinc-800/20">
                <td className="p-4 font-bold text-white bg-[#0d0d12]">WB RERA Registration</td>
                {comparison.properties.map((p: any) => (
                  <td key={p.id} className="p-4 text-emerald-400 font-mono text-[11px]">
                    {p.reraId}
                  </td>
                ))}
              </tr>

              {/* Amenities Section Header */}
              <tr className="bg-zinc-900/60 border-t-2 border-zinc-700">
                <td colSpan={comparison.properties.length + 1} className="p-3 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Amenities & Facilities Matrix
                </td>
              </tr>

              {/* Amenities Rows */}
              {comparison.amenitiesComparison.map((row: any) => (
                <tr key={row.amenity} className="hover:bg-zinc-800/20">
                  <td className="p-4 text-zinc-300 font-sans font-medium bg-[#0d0d12]">
                    {row.amenity}
                  </td>
                  {row.availability.map((item: any) => (
                    <td key={item.propertyId} className="p-4">
                      {item.hasAmenity ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800/60 border border-zinc-800 flex items-center justify-center text-zinc-600">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesComparePage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <Link
          href="/customer/shortlist"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shortlist</span>
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Multi-Property Evaluation Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Side-by-Side Property Comparison</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Compare price per square foot, carpet configurations, possession dates, and verified amenities checklist.
          </p>
        </div>

        <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-zinc-500">Loading matrix...</div>}>
          <CompareContent />
        </Suspense>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Side-by-Side Comparison Engine.</p>
      </footer>
    </div>
  );
}
