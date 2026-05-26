import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
  invertDelta = false,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
  invertDelta?: boolean;
}) {
  const isPositive = delta !== undefined && (invertDelta ? delta < 0 : delta > 0);
  const isNegative = delta !== undefined && (invertDelta ? delta > 0 : delta < 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-sentinel-cyan/10 text-sentinel-cyan flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
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
