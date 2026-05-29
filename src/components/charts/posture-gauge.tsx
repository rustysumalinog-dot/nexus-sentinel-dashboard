"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useApp } from "@/lib/app-provider";
import { useCountUp } from "@/lib/use-count-up";

export function PostureGauge({ score }: { score: number }) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const animated = Math.round(useCountUp(score, 1400));

  const color = score >= 85 ? (isDark ? "#10b981" : "#059669") : score >= 70 ? (isDark ? "#f59e0b" : "#d97706") : (isDark ? "#ef4444" : "#dc2626");
  const track = isDark ? "#1e293b" : "#e2e8f0";

  const data = [{ name: "posture", value: animated, fill: color }];

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="72%"
          outerRadius="100%"
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: track }} dataKey="value" cornerRadius={12} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-4xl font-black text-foreground tabular-nums" style={{ color }}>
          {animated}
        </div>
        <div className="text-xs text-muted uppercase tracking-widest font-mono">/ 100</div>
        <div className="text-[11px] font-semibold mt-1" style={{ color }}>
          {score >= 85 ? "STRONG" : score >= 70 ? "MODERATE" : "AT RISK"}
        </div>
      </div>
    </div>
  );
}
