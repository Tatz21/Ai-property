"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  highlight?: string;
}

interface TestimonialsCardProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialsCard({ testimonials, className }: TestimonialsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex] || {
    id: "1",
    name: "Subhashis Mukherjee",
    role: "Tech Entrepreneur",
    location: "New Town, Action Area II",
    content: "The AI understood my requirement for a 3BHK flat near Eco Park with high-speed fiber connectivity within 20 seconds. Handed off to a verified specialist seamlessly!",
    rating: 5,
    highlight: "Found dream home in 4 days"
  };

  return (
    <div className={cn("relative w-full max-w-xl mx-auto", className)}>
      {/* Background stacked illusion cards */}
      <div className="absolute inset-0 translate-y-3 scale-[0.96] rounded-[20px] bg-zinc-900/40 border border-zinc-800/40 blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 translate-y-6 scale-[0.92] rounded-[20px] bg-zinc-900/20 border border-zinc-800/20 blur-[2px] pointer-events-none" />

      {/* Main active card */}
      <div className="relative rounded-[20px] p-6 sm:p-8 bg-[#121218]/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < current.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                )}
              />
            ))}
          </div>
          <Quote className="w-6 h-6 text-zinc-600 opacity-60" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {current.highlight && (
              <span className="inline-block text-xs font-mono font-medium text-cyan-400 mb-2">
                // {current.highlight}
              </span>
            )}
            <p className="text-zinc-200 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              "{current.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <div>
                <h4 className="font-semibold text-zinc-100 text-sm sm:text-base">
                  {current.name}
                </h4>
                <p className="text-xs text-zinc-400">
                  {current.role} • <span className="text-zinc-500">{current.location}</span>
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
