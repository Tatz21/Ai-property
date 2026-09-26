"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarCheck, Shield, Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { VisitRecord } from "@/lib/visits/types";

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Phase 6 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Platform Visit Scheduling Oversight
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Track all customer site inspections across Kolkata micro-markets, monitor completion rates, and audit cancellations.
        </p>
      </div>

      {/* Visits Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Visit ID & Date</th>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-cyan-400 font-semibold">{v.id}</span>
                    <div className="text-[10px] text-zinc-400">{v.slotDate} • {v.slotTime}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white line-clamp-1">{v.propertyTitle}</div>
                    <div className="text-[11px] text-zinc-400">{v.propertyLocality}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{v.customerName}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{v.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {v.agentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border uppercase ${
                        v.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : v.status === "completed"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : v.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/properties/${v.propertyId}`}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[11px] inline-block transition-colors"
                    >
                      Property
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
