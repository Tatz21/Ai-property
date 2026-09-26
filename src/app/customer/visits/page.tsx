"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { CalendarCheck, Calendar, Clock, MapPin, Phone, User, X, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { VisitRecord } from "@/lib/visits/types";

export default function CustomerVisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
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

  const handleCancelVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingId || !cancelReason.trim()) return;

    try {
      const res = await fetch(`/api/visits/${cancellingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (res.ok) {
        setFeedback("Site visit cancelled successfully");
        setCancellingId(null);
        setCancelReason("");
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Customer Visit Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Scheduled Site Visits</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Track upcoming property inspections, meet assigned local specialists, and manage booking dates.
            </p>
          </div>

          <Link
            href="/properties"
            className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
          >
            Explore More Properties
          </Link>
        </div>

        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Cancel Modal */}
        {cancellingId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Cancel Site Inspection</h3>
              <p className="text-xs text-zinc-400">Please provide a reason so your specialist can adjust schedule:</p>

              <form onSubmit={handleCancelVisit} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule clash, would like to reschedule next week..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancellingId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:text-white"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-xs"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-zinc-500">Loading your visits...</div>
        ) : visits.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-8">
            <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No Site Visits Scheduled</h3>
            <p className="text-xs text-zinc-500 mb-4">You have not booked any physical property inspections yet.</p>
            <Link href="/properties" className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold">
              Browse Kolkata Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                        visit.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : visit.status === "scheduled"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                          : visit.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {visit.status}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      ID: <strong className="text-zinc-300">{visit.id}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{visit.propertyTitle}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{visit.propertyLocality}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-mono text-cyan-300 font-semibold">{formatINR(visit.propertyPrice)}</span>
                  </div>

                  {/* Date & Time Slot highlight */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-300">
                    <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{visit.slotDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{visit.slotTime}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 pt-1">
                    Assigned Property Specialist: <strong className="text-white">{visit.agentName}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                  <Link
                    href={`/properties/${visit.propertyId}`}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors flex items-center gap-1"
                  >
                    <span>View Property</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {visit.status !== "cancelled" && visit.status !== "completed" && (
                    <button
                      onClick={() => setCancellingId(visit.id)}
                      className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs text-red-300 transition-colors cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Visit Subsystem.</p>
      </footer>
    </div>
  );
}
