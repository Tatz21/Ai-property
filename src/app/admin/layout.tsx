import React from "react";
import Link from "next/link";
import { Shield, Users, Building2, UserCheck, Bot, Settings, FileText, ArrowLeft, Sliders, Briefcase, CalendarCheck, DollarSign, Globe } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111116] border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">Admin Console</h2>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Phase 0 Shell</span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white bg-zinc-800/80 border border-zinc-700/50"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Dashboard & Health</span>
            </Link>

            <div className="pt-4 pb-2 px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Operations
            </div>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Users & RBAC</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Leads Oversight</span>
            </Link>

            <Link
              href="/admin/properties"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Property Moderation</span>
            </Link>

            <Link
              href="/admin/developers"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Developer Partners</span>
            </Link>

            <Link
              href="/admin/visits"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Visits Oversight</span>
            </Link>

            <Link
              href="/admin/revenue"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Revenue & Commission</span>
            </Link>

            <Link
              href="/admin/ai"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI Engine Telemetry</span>
            </Link>

            <Link
              href="/admin/matching"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Matching Engine</span>
            </Link>

            <Link
              href="/admin/seo"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>SEO & Growth Engine</span>
            </Link>

            <Link
              href="/admin#audit-logs"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Audit Logs</span>
            </Link>

            <Link
              href="/admin#settings"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
