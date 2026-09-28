"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-zinc-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Critical System Error</h2>
          <p className="text-xs text-zinc-400">
            A fatal error occurred at the application boundary.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-xl"
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
}
