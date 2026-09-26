"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  ArrowLeft, Phone, Mail, MessageSquare, Bot, User, 
  CheckCircle2, Plus, Calendar, Clock, ShieldCheck, Heart, Sparkles, AlertCircle
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { LeadRecord, LeadStatus, CRMTask, CRMNote } from "@/lib/leads/types";

const PIPELINE_STAGES: { key: LeadStatus; label: string }[] = [
  { key: "new", label: "New Lead" },
  { key: "contacted", label: "Contacted" },
  { key: "visit_scheduled", label: "Visit Scheduled" },
  { key: "negotiation", label: "Negotiation" },
  { key: "closed", label: "Closed / Won" },
  { key: "lost", label: "Lost / Archive" },
];

export default function AgentLeadDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [conversation, setConversation] = useState<any | null>(null);
  const [shortlistedProperties, setShortlistedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("2026-10-02");
  const [taskType, setTaskType] = useState<"call" | "visit" | "followup" | "document">("call");

  // New Note form state
  const [noteContent, setNoteContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();
      if (res.ok && data.lead) {
        setLead(data.lead);
        setConversation(data.conversation);
        setShortlistedProperties(data.shortlistedProperties || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLeadDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/leads/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          dueDate: new Date(taskDueDate).toISOString(),
          type: taskType,
        }),
      });

      if (res.ok) {
        setTaskTitle("");
        fetchLeadDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        fetchLeadDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });

      if (res.ok) {
        setNoteContent("");
        fetchLeadDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center font-mono text-xs text-zinc-500">
        Loading lead details & AI transcript...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">Lead Not Found</h2>
        <Link href="/agent/dashboard" className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full z-10 space-y-6">
        <Link
          href="/agent/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Lead Inbox</span>
        </Link>

        {/* Lead Header */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                    lead.intent === "high"
                      ? "bg-red-500/10 text-red-400 border-red-500/20 font-bold"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {lead.intent.toUpperCase()} INTENT (Score: {lead.score}/100)
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Source: <strong className="text-zinc-200">{lead.source}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{lead.customerName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mt-2">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Phone className="w-3.5 h-3.5" />
                  {lead.customerPhone}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Mail className="w-3.5 h-3.5" />
                  {lead.customerEmail}
                </span>
              </div>
            </div>

            {/* Quick Action Contact Button */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${lead.customerPhone}`}
                className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Call</span>
              </a>
            </div>
          </div>

          {/* Pipeline Stage Stepper */}
          <div className="pt-4 border-t border-zinc-800/80">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">Pipeline Deal Stage</span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {PIPELINE_STAGES.map((st) => (
                <button
                  key={st.key}
                  onClick={() => handleUpdateStatus(st.key)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    lead.status === st.key
                      ? "bg-cyan-500 text-black font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Grid: AI Transcript (Left) + CRM Notes & Tasks (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: AI Transcript & Extracted Criteria */}
          <div className="space-y-6">
            {/* Extracted Criteria Card */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Extracted Requirements</span>
              </h2>
              <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 leading-relaxed">
                {lead.requirementsSummary || "No structured summary available."}
              </p>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px] uppercase">Locality</span>
                  <span className="text-white font-semibold">{lead.preferredLocality || "Kolkata"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px] uppercase">Max Budget</span>
                  <span className="text-cyan-300 font-semibold">{lead.budgetCap ? formatINR(lead.budgetCap) : "Open"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[9px] uppercase">Config</span>
                  <span className="text-white font-semibold">{lead.bhkPreference ? `${lead.bhkPreference} BHK` : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* AI Conversation Transcript */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Full AI Conversation Transcript</span>
              </h2>

              {conversation && conversation.messages.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-4 p-2 bg-zinc-950/60 rounded-xl border border-zinc-850">
                  {conversation.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs ${
                        msg.senderType === "user"
                          ? "bg-cyan-950/40 border border-cyan-500/30 text-zinc-100 ml-4"
                          : "bg-zinc-900/90 border border-zinc-800 text-zinc-300 mr-4"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">
                        {msg.senderType === "user" ? "Customer" : "EstateAI Kolkata"}
                      </span>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                  No previous conversation transcript logged.
                </div>
              )}
            </div>

            {/* Shortlisted Properties */}
            {shortlistedProperties.length > 0 && (
              <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 space-y-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Customer Shortlisted Properties ({shortlistedProperties.length})</span>
                </h2>
                <div className="space-y-2">
                  {shortlistedProperties.map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-white">{p.title}</h4>
                        <span className="text-[11px] text-zinc-400">{p.locality} • {formatINR(p.price)}</span>
                      </div>
                      <Link
                        href={`/properties/${p.id}`}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 text-[11px] text-cyan-300 hover:bg-zinc-700"
                      >
                        Inspect
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: CRM Tasks & Notes */}
          <div className="space-y-6">
            {/* CRM Tasks Scheduler */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>CRM Follow-up Tasks</span>
              </h2>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Call customer for site visit slot..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Task Items */}
              <div className="space-y-2">
                {lead.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      task.completed ? "bg-zinc-950/40 border-zinc-850 opacity-60" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                      />
                      <span className={task.completed ? "line-through text-zinc-500" : "text-zinc-200"}>
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                      {new Date(task.dueDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CRM Notes */}
            <div className="rounded-2xl bg-[#111116] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Agent Interaction Notes</span>
              </h2>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  required
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record customer budget feedback, loan status, or visit preferences..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={submitting || !noteContent.trim()}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Agent Note
                </button>
              </form>

              {/* Note Stream */}
              <div className="space-y-3 pt-2">
                {lead.notes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <span className="text-cyan-400 font-semibold">{note.authorName}</span>
                      <span>{new Date(note.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Lead Pipeline & CRM View.</p>
      </footer>
    </div>
  );
}
