"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useApp } from "@/lib/app-provider";

interface Slice {
  severity: string;
  count: number;
}

const COLORS: Record<string, { light: string; dark: string }> = {
  critical: { light: "#dc2626", dark: "#ef4444" },
  high: { light: "#ea580c", dark: "#fb923c" },
  medium: { light: "#d97706", dark: "#f59e0b" },
  low: { light: "#0e7490", dark: "#06b6d4" },
  info: { light: "#64748b", dark: "#94a3b8" },
};

export function SeverityDonut({ data }: { data: Slice[] }) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const total = data.reduce((s, d) => s + d.count, 0);
  const filtered = data.filter((d) => d.count > 0);

  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#1e293b" : "#cbd5e1";
  const tooltipText = isDark ? "#e2e8f0" : "#0f172a";

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="count"
            nameKey="severity"
            innerRadius="62%"
            outerRadius="100%"
            paddingAngle={3}
            stroke="none"
          >
            {filtered.map((d) => (
              <Cell key={d.severity} fill={isDark ? COLORS[d.severity].dark : COLORS[d.severity].light} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n) => [`${v} events`, String(n)]}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
              backgroundColor: tooltipBg,
              color: tooltipText,
              textTransform: "capitalize",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-3xl font-black text-foreground tabular-nums">{total}</div>
        <div className="text-[10px] text-muted uppercase tracking-widest font-mono">events</div>
      </div>
    </div>
  );
}
