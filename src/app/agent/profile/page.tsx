"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { ShieldCheck, MapPin, Award, Briefcase, CheckCircle2, Save, ArrowRight } from "lucide-react";

const KOLKATA_LOCALITIES = [
  "New Town Action Area I",
  "New Town Action Area II",
  "New Town Action Area III",
  "Salt Lake Sector V",
  "Salt Lake Sector I/II/III",
  "Rajarhat",
  "EM Bypass",
  "Ballygunge",
  "Alipore",
  "Behala"
];

const SPECIALTIES = [
  "Luxury Apartments",
  "High-Rise Sky Villas",
  "Commercial IT Space",
  "Affordable Housing",
  "Gated Communities",
  "Plot & Land Development"
];

export default function AgentProfilePage() {
  const [name, setName] = useState("Sanjay Bhattacharya");
  const [phone, setPhone] = useState("+91 98301 22334");
  const [reraLicense, setReraLicense] = useState("WBRERA/A/KOL/2022/000145");
  const [experienceYears, setExperienceYears] = useState(8);
  const [serviceAreas, setServiceAreas] = useState<string[]>([
    "New Town Action Area I",
    "New Town Action Area II",
    "Rajarhat",
    "Salt Lake Sector V"
  ]);
  const [specialties, setSpecialties] = useState<string[]>([
    "Luxury Apartments",
    "High-Rise Sky Villas",
    "Commercial IT Space"
  ]);
  const [availability, setAvailability] = useState<"active" | "busy" | "away">("active");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleArea = (area: string) => {
    if (serviceAreas.includes(area)) {
      setServiceAreas(serviceAreas.filter(a => a !== area));
    } else {
      setServiceAreas([...serviceAreas, area]);
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (specialties.includes(spec)) {
      setSpecialties(specialties.filter(s => s !== spec));
    } else {
      setSpecialties([...specialties, spec]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          reraLicenseNumber: reraLicense,
          serviceAreas,
          specialties,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Agent Partner Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Agent Profile & Service Areas</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Configure your territory and specialties to receive qualified high-intent leads from EstateAI.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Update Agent Setup"}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Agent territory and licensing verified and updated in real-time!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent Identity & RERA Info */}
          <div className="md:col-span-1 rounded-[20px] bg-[#111116] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Licensing & Contact</span>
            </h2>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">RERA License Number</label>
              <input
                type="text"
                value={reraLicense}
                onChange={(e) => setReraLicense(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Lead Routing Status</label>
              <select
                value={availability}
                onChange={(e: any) => setAvailability(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="active">🟢 Active (Receiving Leads)</option>
                <option value="busy">🟡 Busy (Visits Scheduled)</option>
                <option value="away">🔴 Away (Pause Allocation)</option>
              </select>
            </div>
          </div>

          {/* Service Area & Specialties */}
          <div className="md:col-span-2 rounded-[20px] bg-[#111116] border border-zinc-800 p-6 space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Assigned Service Micro-Markets</span>
            </h2>

            <div>
              <p className="text-xs text-zinc-400 mb-3">
                Select Kolkata zones where you conduct physical inspections and host buyer site visits:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {KOLKATA_LOCALITIES.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleArea(loc)}
                    className={`text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      serviceAreas.includes(loc)
                        ? "bg-cyan-950/60 border-cyan-500/60 text-cyan-200"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{loc}</span>
                    {serviceAreas.includes(loc) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-zinc-300 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Property Specialties & Asset Classes</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialty(spec)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      specialties.includes(spec)
                        ? "bg-purple-950/60 border-purple-500/60 text-purple-200 font-medium"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Phase 1 Agent Surface.</p>
      </footer>
    </div>
  );
}
