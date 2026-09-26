"use client";

import React, { useState, useEffect } from "react";
import { Bot, Activity, Cpu, Sparkles, CheckCircle2, Clock, Zap } from "lucide-react";
import { AIRunRecord } from "@/lib/ai/types";

export default function AdminAITelemetryPage() {
  const [runs, setRuns] = useState<AIRunRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In actual production, fetched from /api/admin/ai-runs
    setRuns([
      {
        id: "run-001",
        conversationId: "conv-demo-01",
        model: "gemini-2.0-flash",
        promptVersion: "v1.2-kolkata-agent",
        latencyMs: 340,
        tokensUsed: 420,
        status: "success",
        toolsInvoked: ["extractRequirementsTool", "searchPropertiesTool"],
        createdAt: new Date().toISOString()
      },
      {
        id: "run-002",
        conversationId: "conv-demo-02",
        model: "gemini-2.0-flash",
        promptVersion: "v1.2-kolkata-agent",
        latencyMs: 290,
        tokensUsed: 315,
        status: "success",
        toolsInvoked: ["searchPropertiesTool"],
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Phase 3 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          AI Engine Telemetry & Prompt Versioning
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Monitor LLM performance, latency benchmarks, tool invocation metrics, and prompt versioning.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Active Model</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Gemini 2.0 Flash</div>
          <span className="text-xs text-zinc-500 mt-1 block">Prompt: v1.2-kolkata-agent</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Avg. Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono">315 ms</div>
          <span className="text-xs text-zinc-500 mt-1 block">Sub-second execution</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Tool Accuracy</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">100%</div>
          <span className="text-xs text-zinc-500 mt-1 block">Zero unhandled exceptions</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Safe Fallback</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">Active</div>
          <span className="text-xs text-zinc-500 mt-1 block">PostGIS rule fallback</span>
        </div>
      </div>

      {/* AI Runs Log Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Recent AI Execution Runs</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Conversation</th>
                <th className="py-3 px-4">Model & Version</th>
                <th className="py-3 px-4">Tools Invoked</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Tokens</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {runs.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4 text-cyan-400">{r.id}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{r.conversationId}</td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <div>{r.model}</div>
                    <div className="text-[10px] text-purple-400">{r.promptVersion}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {r.toolsInvoked.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">{r.latencyMs} ms</td>
                  <td className="py-3.5 px-4 text-zinc-400">{r.tokensUsed}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r.status}
                    </span>
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
