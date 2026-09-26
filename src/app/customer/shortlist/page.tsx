"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Heart, Trash2, Scale, ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function CustomerShortlistPage() {
  const router = useRouter();
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shortlists");
      const data = await res.json();
      if (res.ok && data.shortlist) {
        setShortlist(data.shortlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/shortlists?propertyId=${propertyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShortlist(prev => prev.filter(p => p.id !== propertyId));
        setSelectedForCompare(prev => prev.filter(id => id !== propertyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectForCompare = (propertyId: string) => {
    if (selectedForCompare.includes(propertyId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== propertyId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert("You can compare up to 4 properties simultaneously.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, propertyId]);
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length < 2) {
      alert("Please select at least 2 properties to compare.");
      return;
    }
    router.push(`/properties/compare?ids=${selectedForCompare.join(",")}`);
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono mb-2">
              <Heart className="w-3.5 h-3.5 fill-red-400" />
              <span>Customer Shortlist & Saved Favorites</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Shortlisted Properties</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Review saved homes, compare metrics side-by-side, or book priority site visits.
            </p>
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              onClick={handleLaunchCompare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Selected ({selectedForCompare.length})</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-zinc-500">
            Loading your shortlisted properties...
          </div>
        ) : shortlist.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-8">
            <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium mb-1">No shortlisted properties yet</p>
            <p className="text-xs text-zinc-500 mb-4">Explore Kolkata listings or use our AI Concierge to find homes.</p>
            <Link
              href="/properties"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-medium hover:bg-cyan-400 transition-colors"
            >
              Browse Kolkata Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.map((prop) => {
              const isSelected = selectedForCompare.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  className={`rounded-[20px] bg-[#111116] border transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                    isSelected ? "border-cyan-500 ring-1 ring-cyan-500/50" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="relative h-44 w-full bg-zinc-900">
                    <img
                      src={prop.media?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemove(prop.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 backdrop-blur-md transition-colors cursor-pointer"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {prop.verificationStatus.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{prop.locality}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{prop.title}</h3>
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-4">
                        <span className="text-cyan-300 font-bold">{formatINR(prop.price)}</span>
                        <span className="text-zinc-400">{prop.bhk > 0 ? `${prop.bhk} BHK` : "Commercial"} • {prop.areaSqFt} sq.ft</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                      <button
                        onClick={() => toggleSelectForCompare(prop.id)}
                        className={`w-full py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-cyan-950/60 border-cyan-500/60 text-cyan-200 font-semibold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isSelected ? "Selected for Compare" : "Add to Compare"}</span>
                      </button>

                      <Link
                        href={`/properties/${prop.id}`}
                        className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>View Details & Schedule Visit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Customer Shortlist Experience.</p>
      </footer>
    </div>
  );
}
