"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  CalendarCheck, Calendar, Clock, Phone, MapPin, 
  Check, X, CheckCircle2, User, ArrowRight, AlertCircle
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { VisitRecord, VisitStatus } from "@/lib/visits/types";

export default function AgentVisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/visits");
      const data = await res.json();
      if (res.ok && data.visits) {
        setVisits(data.visits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleUpdateStatus = async (visitId: string, status: VisitStatus) => {
    try {
      const res = await fetch(`/api/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setFeedback(`Visit updated to ${status.toUpperCase()}`);
        fetchVisits();
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Agent Schedule & Inspection Calendar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Site Inspection Schedule</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage client property walkthroughs, confirm appointments, and mark inspection outcomes.
            </p>
          </div>

          <Link
            href="/agent/dashboard"
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Visits Stream & Actions */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Assigned Inspections ({visits.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-zinc-500">Loading visit calendar...</div>
          ) : visits.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">No scheduled visits in queue.</div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-800/20 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                          visit.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold"
                            : visit.status === "completed"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : visit.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                        }`}
                      >
                        {visit.status}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Date: <strong className="text-white">{visit.slotDate}</strong> at <strong className="text-cyan-300">{visit.slotTime}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{visit.propertyTitle}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{visit.propertyLocality}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="font-mono text-cyan-300">{formatINR(visit.propertyPrice)}</span>
                    </p>

                    <div className="text-xs text-zinc-300 flex items-center gap-3 pt-1">
                      <span className="font-semibold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        {visit.customerName}
                      </span>
                      <a href={`tel:${visit.customerPhone}`} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {visit.customerPhone}
                      </a>
                    </div>

                    {visit.cancellationReason && (
                      <div className="text-[11px] text-red-400 font-mono bg-red-950/30 p-2 rounded-lg border border-red-500/20">
                        Cancellation Note: {visit.cancellationReason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {visit.status === "scheduled" && (
                      <button
                        onClick={() => handleUpdateStatus(visit.id, "confirmed")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                    )}

                    {visit.status === "confirmed" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(visit.id, "completed")}
                          className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(visit.id, "no_show")}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Mark No-Show
                        </button>
                      </>
                    )}

                    <Link
                      href={`/properties/${visit.propertyId}`}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                    >
                      Property Info
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Agent Inspection Subsystem.</p>
      </footer>
    </div>
  );
}
