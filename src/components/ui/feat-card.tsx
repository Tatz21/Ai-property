"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "violet" | "amber" | "emerald";
}

export function FeatCard({
  title,
  description,
  badge,
  icon,
  children,
  className,
  glowColor = "cyan",
}: FeatCardProps) {
  const glowMap = {
    cyan: "group-hover:border-cyan-500/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    violet: "group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    amber: "group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    emerald: "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-8",
        "bg-[#111116]/80 dark:bg-[#111116]/80 bg-zinc-900/50 backdrop-blur-xl",
        "border border-zinc-800/80 transition-all duration-300",
        glowMap[glowColor],
        className
      )}
    >
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      {/* Header section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          {icon && (
            <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
              {icon}
            </div>
          )}
          {badge && (
            <span className="text-[11px] uppercase tracking-wider font-mono px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
          {description}
        </p>
      </div>

      {/* Interactive / Custom slot */}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}
