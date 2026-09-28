"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Building2, Search, Compass, ShieldCheck, 
  User, LogOut, ChevronDown, Check, Layers, UserCheck, Briefcase, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "AI Concierge", href: "/ai-chat", icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  { label: "All Properties", href: "/properties", icon: <Building2 className="w-4 h-4" /> },
  { label: "Compare", href: "/properties/compare", icon: <Search className="w-4 h-4" /> },
  { label: "Buyer Guides", href: "/guides", icon: <Compass className="w-4 h-4" /> },
];

const PERSONAS = [
  { role: "admin", name: "System Admin", label: "Admin", href: "/admin", color: "bg-red-500/10 text-red-400 border-red-500/30" },
  { role: "customer", name: "Dr. Anirban Sengupta", label: "Buyer", href: "/customer/profile", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { role: "agent", name: "Sanjay Bhattacharya", label: "Agent", href: "/agent/dashboard", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { role: "owner", name: "Debasish Roy", label: "Seller", href: "/owner/dashboard", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { role: "developer", name: "Bengal Shapoorji", label: "Developer", href: "/developer/dashboard", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
];

export function SpotlightNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [userSession, setUserSession] = useState<{
    authenticated: boolean;
    name?: string;
    email?: string;
    role?: string;
    userId?: string;
  }>({ authenticated: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && data.session) {
          setUserSession({
            authenticated: true,
            name: data.session.name,
            email: data.session.email,
            role: data.session.role,
            userId: data.session.userId,
          });
        } else {
          setUserSession({ authenticated: false });
        }
      } catch {
        setUserSession({ authenticated: false });
      }
    }
    loadSession();
  }, [pathname]);

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
        setUserSession({
          authenticated: true,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          userId: data.user.id,
        });
        setMenuOpen(false);

        // Redirect to their dashboard
        if (role === "admin") router.push("/admin");
        else if (role === "customer") router.push("/customer/profile");
        else if (role === "agent") router.push("/agent/dashboard");
        else if (role === "owner") router.push("/owner/dashboard");
        else if (role === "developer") router.push("/developer/dashboard");
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
      setUserSession({ authenticated: false });
      setMenuOpen(false);
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const activePersona = PERSONAS.find((p) => p.role === userSession.role) || PERSONAS[0];

  return (
    <header className="sticky top-4 z-50 flex justify-center w-full px-4 pointer-events-none">
      <nav className="pointer-events-auto relative flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#111116]/90 border border-zinc-800/90 shadow-2xl backdrop-blur-2xl max-w-5xl w-full">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 pl-2 pr-3 py-1 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              EstateAI
            </span>
            <span className="text-[9px] font-mono text-cyan-400/80 -mt-1 tracking-wider uppercase">
              Kolkata
            </span>
          </div>
        </Link>

        {/* Center Nav Links with ambient spotlight hover */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors",
                  isActive ? "text-cyan-300 font-semibold" : "text-zinc-300 hover:text-white"
                )}
              >
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="spotlight"
                    className="absolute inset-0 rounded-full bg-zinc-800/80 border border-zinc-700/50 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side CTAs & Active Persona Indicator */}
        <div className="flex items-center gap-2 pr-1 relative">
          {userSession.authenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/70 text-xs text-white transition-all cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(userSession.name || "U").slice(0, 2).toUpperCase()}
                </div>
                <span className="font-medium text-xs hidden sm:inline truncate max-w-[120px]">
                  {userSession.name?.split(" ")[0]}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border ${activePersona.color}`}>
                  {activePersona.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Persona Switcher / User Menu Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#14141b] border border-zinc-700/80 shadow-2xl p-2.5 z-50 space-y-2"
                  >
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <div className="text-xs font-bold text-white">{userSession.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{userSession.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500">Active Role:</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase border ${activePersona.color}`}>
                          {activePersona.name}
                        </span>
                      </div>
                    </div>

                    {/* Quick Link to Dedicated Dashboard */}
                    <Link
                      href={activePersona.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/20 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Open {activePersona.label} Dashboard</span>
                    </Link>

                    {/* Persona Switcher Options */}
                    <div className="space-y-1">
                      <div className="px-3 pt-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-zinc-400" />
                        <span>Switch Persona Instantly</span>
                      </div>
                      {PERSONAS.map((p) => (
                        <button
                          key={p.role}
                          disabled={isSwitching}
                          onClick={() => handleSwitchRole(p.role)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            userSession.role === p.role
                              ? "bg-zinc-800 text-white font-semibold border border-zinc-700"
                              : "hover:bg-zinc-850 text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase border ${p.color}`}>
                              {p.label}
                            </span>
                            <span className="text-xs truncate max-w-[130px]">{p.name}</span>
                          </div>
                          {userSession.role === p.role && (
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center px-1">
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="text-[11px] text-zinc-400 hover:text-cyan-400 transition-colors font-mono"
                      >
                        Admin Shell
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-950/40 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:bg-zinc-800/60 transition-all"
              >
                Admin Shell
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-100 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5 text-zinc-300" />
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
