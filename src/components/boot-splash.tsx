"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BOOT_LINES: { text: string; delay: number }[] = [
  { text: "> Initializing core protocols...", delay: 200 },
  { text: "> Establishing secure uplink to Hostinger node...", delay: 700 },
  { text: "> Verifying clearance: ARCHITECT", delay: 1300 },
  { text: "> Synchronizing 12 monitored assets...", delay: 1900 },
  { text: "> WAF online · CSP enforced · TLS 1.3", delay: 2500 },
  { text: "> All systems nominal. Ready, Arkitekto.", delay: 3100 },
];

const AUTO_DISMISS_MS = 4400;

export function BootSplash({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleLines((n) => Math.max(n, i + 1)), BOOT_LINES[i].delay)
      );
    });

    const fadeTimer = setTimeout(() => setFading(true), AUTO_DISMISS_MS);
    const doneTimer = setTimeout(() => onDone(), AUTO_DISMISS_MS + 600);
    timers.push(fadeTimer, doneTimer);

    const skip = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape" && e.key !== "Enter") return;
      setFading(true);
      setTimeout(onDone, 400);
    };
    window.addEventListener("keydown", skip);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  const handleClick = () => {
    setFading(true);
    setTimeout(onDone, 400);
  };

  return (
    <div
      role="dialog"
      aria-label="Sentinel boot sequence"
      onClick={handleClick}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden cursor-pointer select-none",
        fading && "boot-fade-out"
      )}
    >
      {/* drifting grid background */}
      <div
        aria-hidden
        className="absolute inset-0 boot-grid opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* radial vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.10) 0%, rgba(2, 6, 23, 0) 60%)",
        }}
      />

      {/* horizontal scan line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 h-px boot-scan-line"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.8), transparent)",
          boxShadow: "0 0 16px rgba(6, 182, 212, 0.6)",
        }}
      />

      {/* HUD rings + diamond core */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 boot-ring-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.9)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
        </div>

        {/* Middle ring (dashed, counter-rotate) */}
        <div
          className="absolute inset-6 rounded-full boot-ring-med"
          style={{
            borderImage: "none",
            background: "transparent",
            border: "1px dashed rgba(6, 182, 212, 0.5)",
          }}
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300/70" />
        </div>

        {/* Inner ring (fast spin, arc-only via conic gradient) */}
        <div
          className="absolute inset-14 rounded-full boot-ring-fast"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(6, 182, 212, 0) 0deg, rgba(6, 182, 212, 0) 270deg, rgba(6, 182, 212, 0.9) 330deg, rgba(6, 182, 212, 0) 360deg)",
            mask: "radial-gradient(circle, transparent calc(50% - 2px), black calc(50% - 1px), black 50%, transparent calc(50% + 1px))",
            WebkitMask: "radial-gradient(circle, transparent calc(50% - 2px), black calc(50% - 1px), black 50%, transparent calc(50% + 1px))",
          }}
        />

        {/* Center diamond */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="boot-diamond w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_60px_rgba(6,182,212,0.7)]" />
        </div>

        {/* Crosshair lines */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-8 sm:mb-12">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-cyan-400/80 font-mono mb-3">
          Project Nexus · v0.1.0
        </div>
        <h1
          className="boot-title font-black text-cyan-300 text-3xl sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          THE ENTITY
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3 text-cyan-500/60 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em]">
          <span className="h-px w-12 sm:w-20 bg-cyan-500/40" />
          Sentinel Online
          <span className="h-px w-12 sm:w-20 bg-cyan-500/40" />
        </div>
      </div>

      {/* Boot log */}
      <div className="relative z-10 w-full max-w-md px-6 sm:px-0 font-mono text-xs sm:text-sm">
        <div className="space-y-1.5 min-h-[180px]">
          {BOOT_LINES.map((line, i) => {
            const shown = i < visibleLines;
            const isLatest = i === visibleLines - 1;
            const isFinal = i === BOOT_LINES.length - 1;
            return (
              <div
                key={i}
                className={cn(
                  "transition-all duration-200",
                  shown ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                  isFinal && shown
                    ? "text-emerald-400 font-semibold"
                    : "text-cyan-200/80"
                )}
              >
                {line.text}
                {isLatest && (
                  <span className="boot-caret inline-block w-2 h-3 bg-cyan-300 ml-1 align-middle" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] sm:text-xs text-cyan-500/40 font-mono uppercase tracking-[0.3em] pointer-events-none">
        Press ESC or click anywhere to skip
      </div>

      {/* Corner brackets — HUD chrome */}
      {[
        "top-4 left-4 border-t-2 border-l-2",
        "top-4 right-4 border-t-2 border-r-2",
        "bottom-4 left-4 border-b-2 border-l-2",
        "bottom-4 right-4 border-b-2 border-r-2",
      ].map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={cn("absolute w-8 h-8 border-cyan-400/60 pointer-events-none", pos)}
        />
      ))}
    </div>
  );
}
