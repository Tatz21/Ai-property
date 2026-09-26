"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Search, Filter, MapPin, IndianRupee, BedDouble, ArrowUpDown, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";

const LOCALITIES = [
  "All Localities",
  "New Town Action Area II",
  "Salt Lake Sector V",
  "EM Bypass - Topsia",
  "Rajarhat Chinar Park",
  "Ballygunge",
  "Alipore"
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("All Localities");
  const [selectedBhk, setSelectedBhk] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(30000000);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedLocality !== "All Localities") params.append("locality", selectedLocality);
      if (selectedBhk !== "all") params.append("bhk", selectedBhk);
      if (maxPrice < 30000000) params.append("maxPrice", maxPrice.toString());
      if (verifiedOnly) params.append("verificationStatus", "verified");
      if (sortBy) params.append("sortBy", sortBy);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.properties) {
        setProperties(data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedLocality, selectedBhk, maxPrice, sortBy, verifiedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Kolkata Real Estate Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Homes & Commercial Space in Kolkata
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse verified listings with RERA compliance, live availability, and transparent pricing.
          </p>
        </div>

        {/* Faceted Filter Bar */}
        <div className="rounded-[24px] bg-[#111116]/90 border border-zinc-800 p-5 mb-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, landmarks, amenities (e.g. Eco Park, lake view, swimming pool)..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer shrink-0"
              >
                Search Listings
              </button>
            </div>

            {/* Filter controls row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/60">
              {/* Locality */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Micro-Market</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Bedrooms (BHK)</label>
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All BHKs</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="0">Commercial</option>
                </select>
              </div>

              {/* Max Budget */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-mono text-zinc-400">Max Budget</label>
                  <span className="text-[11px] font-mono text-cyan-400">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={30000000}
                  step={1000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Largest Area</option>
                </select>
              </div>
            </div>

            {/* Verified only toggle */}
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Show RERA Verified Only
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Results Count & Grid */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-mono text-zinc-400">
            Showing <span className="text-cyan-400 font-semibold">{properties.length}</span> matching properties
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-zinc-500">
            Loading verified inventory...
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-8">
            <p className="text-sm text-zinc-300 font-medium mb-1">No matching properties found</p>
            <p className="text-xs text-zinc-500 mb-4">Try broadening your search criteria or price filters.</p>
            <button
              onClick={() => {
                setSelectedLocality("All Localities");
                setSelectedBhk("all");
                setMaxPrice(30000000);
                setSearchQuery("");
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-white hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group rounded-[20px] bg-[#111116] border border-zinc-800/80 overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg"
              >
                {/* Property Image Container */}
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  {property.media[0] ? (
                    <img
                      src={property.media[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      No photo available
                    </div>
                  )}

                  {/* Verification Badge overlay */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {property.verificationStatus === "verified" ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        RERA VERIFIED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        PENDING AUDIT
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {property.possessionDate}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1.5">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{property.locality}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                      {property.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Key Facts Pills */}
                    <div className="flex flex-wrap gap-2 mb-4 text-[11px] font-mono text-zinc-300">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                        {property.bhk > 0 ? `${property.bhk} BHK` : "Commercial"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                        {property.areaSqFt} sq.ft
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 capitalize">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-mono">Price</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {formatINR(property.price)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-800 group-hover:bg-cyan-500 group-hover:text-black text-zinc-300 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Phase 2 Discovery Surface.</p>
      </footer>
    </div>
  );
}
