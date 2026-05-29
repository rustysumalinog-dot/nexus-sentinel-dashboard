"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { useApp } from "@/lib/app-provider";

interface Props {
  data: number[];
  /** Lower values are better (e.g. latency). Flips the "good" color logic. */
  invert?: boolean;
  height?: number;
}

export function Sparkline({ data, invert = false, height = 36 }: Props) {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const points = data.map((v, i) => ({ i, v }));
  const last = data[data.length - 1] ?? 0;
  const first = data[0] ?? 0;
  const rising = last > first;
  // For latency (invert), rising is bad → red; for traffic, rising is good → cyan.
  const good = invert ? !rising : rising;
  const color = good ? (isDark ? "#10b981" : "#059669") : (isDark ? "#f59e0b" : "#d97706");
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
