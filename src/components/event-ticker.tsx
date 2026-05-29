"use client";

import { tickerEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";

const levelDot: Record<string, string> = {
  critical: "bg-red-500",
  warn: "bg-amber-500",
  info: "bg-sentinel-cyan",
  ok: "bg-emerald-500",
};

const levelText: Record<string, string> = {
  critical: "text-red-400",
  warn: "text-amber-400",
  info: "text-sentinel-cyan",
  ok: "text-emerald-400",
};

export function EventTicker() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const items = [...tickerEvents, ...tickerEvents];

  return (
    <div className="bg-slate-950 dark:bg-slate-950 border border-sentinel-cyan/20 rounded-xl overflow-hidden flex items-stretch">
      <div className="flex items-center gap-2 px-4 bg-sentinel-cyan/10 border-r border-sentinel-cyan/20 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-sentinel-cyan opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-cyan" />
        </span>
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-sentinel-cyan hidden sm:inline">
          Live Feed
        </span>
        <Radio size={13} className="text-sentinel-cyan sm:hidden" />
      </div>
      <div className="relative flex-1 overflow-hidden py-2.5">
        <div className="marquee-track">
          {items.map((e, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 text-xs font-mono">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", levelDot[e.level])} />
              <span className={cn(levelText[e.level])}>{e.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
