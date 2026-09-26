"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PerspectiveGridProps {
  className?: string;
}

export function PerspectiveGrid({ className }: PerspectiveGridProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none -z-10",
        className
      )}
      aria-hidden="true"
    >
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/15 via-indigo-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern with 3D perspective slant */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
        <div className="w-full h-full perspective-grid-bg opacity-70" />
      </div>

      {/* Bottom fade mask */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent" />
    </div>
  );
}
