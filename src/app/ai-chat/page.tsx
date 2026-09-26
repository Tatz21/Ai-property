"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  Sparkles, Send, Bot, User, ShieldCheck, MapPin, 
  CheckCircle2, ArrowRight, Loader2, Sliders, CalendarCheck, RotateCcw
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";
import { ExtractedRequirement } from "@/lib/ai/types";

interface ChatMessage {
  id: string;
  senderType: "user" | "assistant";
  content: string;
  matchedProperties?: PropertyRecord[];
  extractedRequirement?: Partial<ExtractedRequirement>;
  createdAt: string;
}

const QUICK_PROMPTS = [
  "Find a 3 BHK near Eco Park New Town under 1 Crore",
  "Show 2 BHK ready to move flats near Rajarhat Chinar Park",
  "Looking for a luxury penthouse on EM Bypass with private terrace",
  "Commercial plug-and-play office space in Salt Lake Sector V"
];

export default function AIChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      senderType: "assistant",
      content: "Hello! I am your AI Property Specialist for Kolkata. Tell me what kind of home or commercial property you are looking for, including your preferred budget, BHK, or specific micro-market.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentRequirements, setCurrentRequirements] = useState<Partial<ExtractedRequirement>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      senderType: "user",
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          message: text,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setConversationId(data.conversationId);
        if (data.extractedRequirement) {
          setCurrentRequirements(prev => ({ ...prev, ...data.extractedRequirement }));
        }

        const assistantMsg: ChatMessage = {
          id: data.message.id,
          senderType: "assistant",
          content: data.message.content,
          matchedProperties: data.matchedProperties,
          extractedRequirement: data.extractedRequirement,
          createdAt: data.message.createdAt,
        };

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            senderType: "assistant",
            content: "I encountered a brief latency glitch. I am falling back to our live database index. Please specify your preferred BHK and locality.",
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetConversation = () => {
    setConversationId(null);
    setCurrentRequirements({});
    setMessages([
      {
        id: "welcome-reset",
        senderType: "assistant",
        content: "Conversation reset. What can I help you find today in Kolkata?",
        createdAt: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col z-10">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Conversational Real Estate Agent • Kolkata</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">AI Property Concierge</h1>
          </div>

          <button
            onClick={handleResetConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Chat Container (3 cols) */}
          <div className="lg:col-span-3 flex flex-col rounded-[24px] bg-[#111116]/90 border border-zinc-800 shadow-2xl backdrop-blur-xl h-[650px] overflow-hidden">
            {/* Message Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.senderType === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm ${
                      msg.senderType === "user"
                        ? "bg-cyan-600 text-white rounded-br-none shadow-lg shadow-cyan-900/20"
                        : "bg-[#181820] border border-zinc-700/60 text-zinc-200 rounded-bl-none shadow-xl"
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                    {/* Matched Property Cards inside AI response */}
                    {msg.matchedProperties && msg.matchedProperties.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-700/60 space-y-3">
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase block">
                          Verified Properties Retrieved ({msg.matchedProperties.length}):
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.matchedProperties.map((p) => (
                            <div
                              key={p.id}
                              className="rounded-xl bg-black/50 border border-zinc-700/80 p-3 flex flex-col justify-between hover:border-cyan-400/60 transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {p.verificationStatus.toUpperCase()}
                                  </span>
                                  <span className="text-[11px] font-mono font-bold text-cyan-300">
                                    {formatINR(p.price)}
                                  </span>
                                </div>
                                <h4 className="font-bold text-xs text-white line-clamp-1">{p.title}</h4>
                                <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{p.locality}</p>
                              </div>

                              <div className="pt-2.5 mt-2 border-t border-zinc-800 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-zinc-400">
                                  {p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"} • {p.areaSqFt} sq.ft
                                </span>
                                <Link
                                  href={`/properties/${p.id}`}
                                  className="text-[10px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.senderType === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3.5 items-center text-xs text-cyan-400 font-mono">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                  <span>AI analyzing requirements & querying verified database...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-zinc-950/60 border-t border-zinc-800/60 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">Suggestions:</span>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-zinc-950/80 border-t border-zinc-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your ideal property (BHK, locality, budget, amenities)..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Persistent Live Memory Sidebar (1 col) */}
          <div className="lg:col-span-1 rounded-[24px] bg-[#111116]/90 border border-zinc-800 p-5 shadow-2xl backdrop-blur-xl h-[650px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
                <Sliders className="w-4 h-4" />
                <span>Extracted Memory</span>
              </div>
              <h3 className="text-base font-bold text-white mb-4">Buyer Criteria Context</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Target Locality</span>
                  <span className="text-white font-medium">
                    {currentRequirements.locality || "Any Kolkata locality"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Bedrooms (BHK)</span>
                  <span className="text-white font-medium">
                    {currentRequirements.bhk ? `${currentRequirements.bhk} BHK` : "Not specified"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Max Budget</span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {currentRequirements.maxPrice ? formatINR(currentRequirements.maxPrice) : "Open"}
                  </span>
                </div>

                {currentRequirements.amenities && currentRequirements.amenities.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Requested Amenities</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentRequirements.amenities.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-xs mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Live Database Sync</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                All recommendations are fetched directly from verified RERA Kolkata inventory.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. AI Conversational Agent Experience.</p>
      </footer>
    </div>
  );
}
