"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Shield, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { ProjectRecord } from "@/lib/db/projects";

export default function AdminDevelopersPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProjects() {
      try {
        setLoading(true);
        const res = await fetch("/api/developer/projects");
        const data = await res.json();
        if (res.ok && data.projects) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Phase 7 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Developer Partner & Township Oversight
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Verify developer RERA licenses, multi-tower phases, unit inventory allocations, and builder credentials.
        </p>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Project Name & Locality</th>
                <th className="py-3.5 px-4">WB RERA ID</th>
                <th className="py-3.5 px-4">Towers / Units</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Possession</th>
                <th className="py-3.5 px-4 text-right">Developer Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[11px] text-zinc-400">{p.locality}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    {p.reraRegistrationNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {p.totalTowers} Towers ({p.totalUnits} Units)
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 capitalize">
                      {p.projectStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {p.possessionDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/developer/dashboard"
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[11px] inline-block transition-colors"
                    >
                      Units Matrix
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
