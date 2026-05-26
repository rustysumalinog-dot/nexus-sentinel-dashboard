"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/lib/app-provider";

interface Props {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  formatter?: (v: number) => string;
}

export function RevenueAreaChart({ data, xKey, yKey, formatter }: Props) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const gridStroke = isDark ? "#1e293b" : "#cbd5e1";
  const axisStroke = isDark ? "#94a3b8" : "#64748b";
  const lineColor = isDark ? "#06b6d4" : "#0e7490";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#1e293b" : "#cbd5e1";
  const tooltipText = isDark ? "#e2e8f0" : "#0f172a";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="sentinelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lineColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} stroke={axisStroke} fontSize={12} />
        <YAxis stroke={axisStroke} fontSize={12} />
        <Tooltip
          formatter={(v) => (formatter ? formatter(Number(v)) : String(v))}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${tooltipBorder}`,
            backgroundColor: tooltipBg,
            color: tooltipText,
          }}
          labelStyle={{ color: tooltipText }}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={lineColor}
          strokeWidth={2}
          fill="url(#sentinelGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
