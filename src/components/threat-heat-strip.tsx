"use client";

import { threatsByHour } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ThreatHeatStrip() {
  const max = Math.max(...threatsByHour.map((h) => h.count));

  const intensity = (count: number) => {
    const t = count / max;
    if (t >= 0.8) return "bg-red-500";
    if (t >= 0.6) return "bg-orange-500";
    if (t >= 0.4) return "bg-amber-500";
    if (t >= 0.2) return "bg-sentinel-cyan/70";
    return "bg-sentinel-cyan/30";
  };

  const peak = threatsByHour.reduce((a, b) => (a.count > b.count ? a : b));

  return (
    <div>
      <div className="grid grid-cols-12 gap-1.5">
        {threatsByHour.map((h) => (
          <div key={h.hour} className="flex flex-col items-center gap-1 group">
            <div
              className={cn(
                "w-full rounded-sm transition-transform group-hover:scale-110 cursor-default",
                intensity(h.count)
              )}
              style={{ height: `${Math.max(8, (h.count / max) * 56)}px` }}
              title={`${h.hour}:00 — ${h.count} events`}
            />
            <span className="text-[9px] text-muted font-mono">{h.hour}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-2 text-muted">
          <span>Low</span>
          <span className="w-3 h-3 rounded-sm bg-sentinel-cyan/30" />
          <span className="w-3 h-3 rounded-sm bg-sentinel-cyan/70" />
          <span className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="w-3 h-3 rounded-sm bg-orange-500" />
          <span className="w-3 h-3 rounded-sm bg-red-500" />
          <span>High</span>
        </div>
        <div className="text-muted">
          Peak: <span className="font-mono text-foreground font-semibold">{peak.hour}:00 ({peak.count})</span>
        </div>
      </div>
    </div>
  );
}
