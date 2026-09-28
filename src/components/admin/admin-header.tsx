"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, User, LogOut, ChevronDown, Check, 
  Sparkles, RefreshCw, Layers, ShieldAlert, ArrowRight 
} from "lucide-react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const PERSONAS = [
  { role: "admin", name: "System Admin", email: "admin@estateai.kolkata.in", badge: "SUPER ADMIN", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { role: "customer", name: "Dr. Anirban Sengupta (Buyer)", email: "anirban.s@example.com", badge: "BUYER / CUSTOMER", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { role: "agent", name: "Sanjay Bhattacharya (Agent)", email: "sanjay.b@estateai.kolkata.in", badge: "PARTNER AGENT", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { role: "owner", name: "Debasish Roy (Seller)", email: "debasish.roy@example.com", badge: "PROPERTY OWNER", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { role: "developer", name: "Bengal Shapoorji Realcon", email: "contact@shapoorji-bengal.com", badge: "DEVELOPER PARTNER", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
];

export function AdminHeader() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser>({
    id: "usr-admin-01",
    name: "System Administrator",
    email: "admin@estateai.kolkata.in",
    role: "admin",
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && data.session) {
          setCurrentUser({
            id: data.session.userId,
            name: data.session.name,
            email: data.session.email,
            role: data.session.role,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadSession();
  }, []);

  const handleSwitchRole = async (role: string) => {
    try {
      setIsSwitching(true);
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        setDropdownOpen(false);

        // Route to the appropriate home for the switched role
        if (role === "customer") router.push("/customer/profile");
        else if (role === "agent") router.push("/agent/dashboard");
        else if (role === "owner") router.push("/owner/dashboard");
        else if (role === "developer") router.push("/developer/dashboard");
        else router.push("/admin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  const currentPersona = PERSONAS.find(p => p.role === currentUser.role) || PERSONAS[0];

  return (
    <div className="w-full bg-[#111116]/90 border-b border-zinc-800/80 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Active User Info & Status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111116]" title="Online" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight">{currentUser.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${currentPersona.color}`}>
              {currentPersona.badge}
            </span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            {currentUser.email}
          </div>
        </div>
      </div>

      {/* Quick Role Switcher & Sign Out */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isSwitching}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-zinc-200 font-medium transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Persona: <strong className="text-white capitalize">{currentUser.role}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#18181f] border border-zinc-700 shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                Switch Active Session Persona
              </div>
              {PERSONAS.map((p) => (
                <button
                  key={p.role}
                  onClick={() => handleSwitchRole(p.role)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    currentUser.role === p.role ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "hover:bg-zinc-800/60 text-zinc-300"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] font-mono text-zinc-400">{p.email}</div>
                  </div>
                  {currentUser.role === p.role && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 text-red-400 text-xs font-medium transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
