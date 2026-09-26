"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  Building2, Plus, Eye, Users, CalendarCheck, TrendingUp, 
  ShieldCheck, Layers, CheckCircle2, ArrowRight, DollarSign, Check
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { ProjectRecord, UnitRecord } from "@/lib/db/projects";
import { ProjectAnalytics } from "@/lib/developer/types";

export default function DeveloperDashboardPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New Unit Form
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitNum, setNewUnitNum] = useState("");
  const [newTower, setNewTower] = useState("Tower 1 - Emerald");
  const [newFloor, setNewFloor] = useState(12);
  const [newType, setNewType] = useState<"1BHK" | "2BHK" | "3BHK" | "4BHK" | "Penthouse">("3BHK");
  const [newCarpet, setNewCarpet] = useState(1150);
  const [newBuiltup, setNewBuiltup] = useState(1550);
  const [newPrice, setNewPrice] = useState(8900000);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, anaRes] = await Promise.all([
        fetch("/api/developer/projects"),
        fetch("/api/developer/analytics")
      ]);

      const projData = await projRes.json();
      const anaData = await anaRes.json();

      if (projData.projects) {
        setProjects(projData.projects);
        if (projData.projects.length > 0) {
          setSelectedProjectId(projData.projects[0].id);
          loadUnits(projData.projects[0].id);
        }
      }

      if (anaData.analytics) {
        setAnalytics(anaData.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (projId: string) => {
    try {
      const res = await fetch(`/api/developer/projects/${projId}/units`);
      const data = await res.json();
      if (res.ok && data.units) {
        setUnits(data.units);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUnitStatus = async (unitId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "available" ? "blocked" : currentStatus === "blocked" ? "sold" : "available";
    try {
      const res = await fetch(`/api/developer/projects/${selectedProjectId}/units`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, status: nextStatus }),
      });

      if (res.ok) {
        setFeedback(`Unit status updated to ${nextStatus.toUpperCase()}`);
        loadUnits(selectedProjectId!);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      const res = await fetch(`/api/developer/projects/${selectedProjectId}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitNumber: newUnitNum,
          tower: newTower,
          floor: newFloor,
          type: newType,
          carpetAreaSqFt: newCarpet,
          superBuiltupSqFt: newBuiltup,
          price: newPrice,
          status: "available",
        }),
      });

      if (res.ok) {
        setFeedback("New unit added to project inventory");
        setShowAddUnit(false);
        setNewUnitNum("");
        loadUnits(selectedProjectId);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Developer & Project Enterprise Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Project & Unit Command</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage multi-unit project towers, real-time unit status toggles, pricing, and campaign analytics.
            </p>
          </div>

          <Link
            href="/developer/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Project</span>
          </Link>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Analytics Grid */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Total Campaign Views</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{analytics.totalViews.toLocaleString()}</div>
              <span className="text-xs text-zinc-500 mt-1 block">{analytics.uniqueVisitors} unique prospective buyers</span>
            </div>

            <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">AI Inquiries</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-300 font-mono">{analytics.inquiriesCount}</div>
              <span className="text-xs text-zinc-500 mt-1 block">{analytics.shortlistCount} shortlisted in buyer feeds</span>
            </div>

            <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Site Inspections</span>
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{analytics.visitsScheduled}</div>
              <span className="text-xs text-zinc-500 mt-1 block">Scheduled on-site visits</span>
            </div>

            <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-300 font-mono">{analytics.conversionRate}%</div>
              <span className="text-xs text-zinc-500 mt-1 block">Discovery-to-visit conversion</span>
            </div>
          </div>
        )}

        {/* Project Selector & Units Matrix */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Selected Project</span>
              <div className="flex items-center gap-3 mt-1">
                <select
                  value={selectedProjectId || ""}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    loadUnits(e.target.value);
                  }}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.locality})</option>
                  ))}
                </select>

                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  RERA Registered
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddUnit(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Unit to Tower</span>
            </button>
          </div>

          {/* Add Unit Modal */}
          {showAddUnit && (
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700 space-y-4">
              <h3 className="text-sm font-bold text-white">Add New Inventory Unit</h3>
              <form onSubmit={handleCreateUnit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={newUnitNum}
                    onChange={(e) => setNewUnitNum(e.target.value)}
                    placeholder="e.g. T1-1204"
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Tower Name</label>
                  <input
                    type="text"
                    required
                    value={newTower}
                    onChange={(e) => setNewTower(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Configuration</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2 text-white"
                  >
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    step={100000}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2 text-cyan-300 font-mono"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUnit(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
                  >
                    Save Unit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Units Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Unit # & Tower</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Carpet / Super Area</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Live Status (Click to Cycle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4 font-bold text-white">
                      {unit.unitNumber}
                      <span className="text-[10px] text-zinc-500 block font-normal">{unit.tower}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{unit.type}</td>
                    <td className="py-3 px-4 font-mono">{unit.floor}th Floor</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {unit.carpetAreaSqFt} / {unit.superBuiltupSqFt} sq.ft
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {formatINR(unit.price)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleUnitStatus(unit.id, unit.status)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase border transition-all cursor-pointer ${
                          unit.status === "available"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : unit.status === "blocked"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {unit.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Developer Enterprise Subsystem.</p>
      </footer>
    </div>
  );
}
