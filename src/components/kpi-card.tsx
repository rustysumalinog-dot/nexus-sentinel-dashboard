"use client";

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/lib/use-count-up";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
  invertDelta?: boolean;
  /** When provided, the value animates 0 → countTo on mount. */
  countTo?: number;
  /** Formats the animated number into the displayed string. */
  format?: (n: number) => string;
  /** Adds a glowing accent border + icon treatment (use for alert/critical cards). */
  alert?: boolean;
}

function AnimatedValue({ countTo, format }: { countTo: number; format: (n: number) => string }) {
  const v = useCountUp(countTo);
  return <span className="tabular-nums">{format(v)}</span>;
}

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  invertDelta = false,
  countTo,
  format,
  alert = false,
}: KpiCardProps) {
  const isPositive = delta !== undefined && (invertDelta ? delta < 0 : delta > 0);
  const isNegative = delta !== undefined && (invertDelta ? delta > 0 : delta < 0);

  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-5 flex flex-col gap-3 transition-colors",
        alert
          ? "border-red-400/50 dark:border-red-500/40 shadow-[0_0_0_1px_rgba(239,68,68,0.15)]"
          : "border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            alert
              ? "bg-red-500/10 text-red-500"
              : "bg-sentinel-cyan/10 text-sentinel-cyan"
          )}
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {countTo !== undefined && format ? (
          <AnimatedValue countTo={countTo} format={format} />
        ) : (
          value
        )}
      </div>
      <div className="flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold",
              isPositive && "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
              isNegative && "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
              !isPositive && !isNegative && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            )}
          >
            {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </div>
  );
}
