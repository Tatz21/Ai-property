"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Building2, ArrowLeft, CheckCircle2, AlertCircle, UploadCloud, MapPin } from "lucide-react";

const KOLKATA_LOCALITIES = [
  "New Town Action Area I",
  "New Town Action Area II",
  "New Town Action Area III",
  "Salt Lake Sector V",
  "EM Bypass - Topsia",
  "Rajarhat Chinar Park",
  "Ballygunge",
  "Alipore",
  "Behala"
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"apartment" | "villa" | "commercial" | "penthouse">("apartment");
  const [bhk, setBhk] = useState(3);
  const [price, setPrice] = useState(8500000);
  const [areaSqFt, setAreaSqFt] = useState(1500);
  const [locality, setLocality] = useState("New Town Action Area II");
  const [address, setAddress] = useState("");
  const [reraId, setReraId] = useState("WBRERA/P/NOR/2024/000889");
  const [possessionDate, setPossessionDate] = useState("Ready to Move");
  const [amenitiesInput, setAmenitiesInput] = useState("Swimming Pool, Clubhouse, 24/7 Power Backup, Covered Parking");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const amenities = amenitiesInput.split(",").map(a => a.trim()).filter(Boolean);
    const images = imageUrl ? [imageUrl] : [];

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          bhk: Number(bhk),
          price: Number(price),
          areaSqFt: Number(areaSqFt),
          locality,
          city: "Kolkata",
          address,
          reraId: reraId || undefined,
          possessionDate,
          amenities,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to create property listing");
      }

      router.push("/agent/properties");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <Link
          href="/agent/properties"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inventory</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Add New Kolkata Listing</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Provide property attributes and compliance documents for platform verification and AI indexing.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-800 pb-2">
              1. Basic Property Information
            </h2>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Listing Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Premium 3 BHK Garden Facing Flat in Action Area II"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Property Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa / Independent</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Bedrooms (BHK)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={bhk}
                  onChange={(e) => setBhk(Number(e.target.value))}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Super Built-up Area (sq.ft)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Total Price (₹)</label>
                <input
                  type="number"
                  required
                  step={100000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Possession Date / Status</label>
                <input
                  type="text"
                  value={possessionDate}
                  onChange={(e) => setPossessionDate(e.target.value)}
                  placeholder="e.g. Ready to Move or Dec 2026"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-800 pb-2">
              2. Location & RERA Compliance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Kolkata Micro-Market</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {KOLKATA_LOCALITIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">WB RERA Registration ID</label>
                <input
                  type="text"
                  value={reraId}
                  onChange={(e) => setReraId(e.target.value)}
                  placeholder="WBRERA/P/NOR/2024/..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Full Physical Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Block/Tower, Street, Landmark, Kolkata 700..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-zinc-800 pb-2">
              3. Description, Amenities & Media
            </h2>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Detailed Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key highlights, floor layout, orientation, sunlight, balcony views..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Amenities (Comma separated)</label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Image URL (or upload)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting Property..." : "Submit Property for Verification"}
          </button>
        </form>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Add Property Workflow.</p>
      </footer>
    </div>
  );
}
