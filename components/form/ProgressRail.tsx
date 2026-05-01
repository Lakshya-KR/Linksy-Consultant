"use client";

import { usePathname } from "next/navigation";

const STEPS = [
  { path: "/propose/scope", label: "Scope" },
  { path: "/propose/timeline", label: "Timeline" },
  { path: "/propose/budget", label: "Budget" },
  { path: "/propose/review", label: "Review" },
];

export function ProgressRail() {
  const pathname = usePathname();
  const idx = STEPS.findIndex((s) => pathname?.startsWith(s.path));
  const current = idx === -1 ? 0 : idx;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
        <span>Step {current + 1} of {STEPS.length}</span>
        <span>{STEPS[current].label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.path}
            className={`h-1 rounded-full transition-colors duration-500 ${
              i <= current ? "bg-foreground" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
