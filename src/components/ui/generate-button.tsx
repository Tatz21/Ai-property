"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  isGenerating?: boolean;
  className?: string;
  glowColor?: "cyan" | "violet" | "amber" | "emerald";
  onGenerate?: () => void;
}

export function GenerateButton({
  children = "Search with AI",
  isGenerating = false,
  className,
  glowColor = "cyan",
  onClick,
  disabled,
  ...props
}: GenerateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: "hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border-cyan-500/30",
    violet: "hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] border-purple-500/30",
    amber: "hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] border-amber-500/30",
    emerald: "hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border-emerald-500/30",
  };

  const accentHues = {
    cyan: "from-cyan-500 via-teal-400 to-indigo-500",
    violet: "from-purple-500 via-pink-400 to-indigo-500",
    amber: "from-amber-400 via-orange-500 to-yellow-300",
    emerald: "from-emerald-400 via-teal-500 to-green-300",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isGenerating ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isGenerating ? 1 : 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isGenerating}
      onClick={onClick}
      className={cn(
        "relative group inline-flex items-center justify-center gap-2.5 px-6 py-3.5",
        "rounded-[24px] bg-[#0c0c12] text-zinc-100 font-medium text-sm sm:text-base",
        "border transition-all duration-300 shadow-lg cursor-pointer select-none",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        glowStyles[glowColor],
        className
      )}
      {...(props as any)}
    >
      {/* Dynamic gradient background shimmer */}
      <div className={cn(
        "absolute -inset-[1px] rounded-[24px] bg-gradient-to-r opacity-30 blur-sm group-hover:opacity-80 transition duration-500",
        accentHues[glowColor]
      )} />

      {/* Button content container */}
      <div className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="w-4 h-4 text-cyan-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkle"
              animate={isHovered ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        <span className="bg-gradient-to-r from-zinc-100 via-white to-zinc-200 bg-clip-text text-transparent tracking-wide font-medium">
          {isGenerating ? "Analyzing Requirements..." : children}
        </span>
      </div>
    </motion.button>
  );
}
