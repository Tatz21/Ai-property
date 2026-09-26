"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Building2, Search, Compass, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "AI Search", href: "/ai-chat", icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  { label: "Explore Kolkata", href: "/properties/kolkata", icon: <Compass className="w-4 h-4" /> },
  { label: "New Town", href: "/properties?locality=New+Town+Action+Area+II", icon: <Building2 className="w-4 h-4" /> },
  { label: "EM Bypass", href: "/properties?locality=EM+Bypass+-+Topsia", icon: <Search className="w-4 h-4" /> },
  { label: "Agent Inventory", href: "/agent/properties", icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
];

export function SpotlightNavbar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <header className="sticky top-4 z-50 flex justify-center w-full px-4 pointer-events-none">
      <nav className="pointer-events-auto relative flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#111116]/85 border border-zinc-800/90 shadow-2xl backdrop-blur-2xl max-w-5xl w-full">
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

        {/* Right side CTAs */}
        <div className="flex items-center gap-2 pr-1">
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
        </div>
      </nav>
    </header>
  );
}
