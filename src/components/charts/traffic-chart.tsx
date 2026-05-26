"use client";

import {
  Bar,
  BarChart,
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
  yLabel?: string;
  color?: "cyan" | "red" | "amber";
}

const COLORS = {
  cyan: { light: "#0e7490", dark: "#06b6d4", cursorLight: "#cffafe", cursorDark: "rgba(6, 182, 212, 0.12)" },
  red: { light: "#dc2626", dark: "#ef4444", cursorLight: "#fee2e2", cursorDark: "rgba(239, 68, 68, 0.14)" },
  amber: { light: "#d97706", dark: "#f59e0b", cursorLight: "#fef3c7", cursorDark: "rgba(245, 158, 11, 0.14)" },
};

export function HourlyBarChart({ data, xKey, yKey, yLabel, color = "cyan" }: Props) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const palette = COLORS[color];
  const gridStroke = isDark ? "#1e293b" : "#cbd5e1";
  const axisStroke = isDark ? "#94a3b8" : "#64748b";
  const barColor = isDark ? palette.dark : palette.light;
  const cursorFill = isDark ? palette.cursorDark : palette.cursorLight;
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#1e293b" : "#cbd5e1";
  const tooltipText = isDark ? "#e2e8f0" : "#0f172a";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} stroke={axisStroke} fontSize={11} />
        <YAxis stroke={axisStroke} fontSize={12} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${tooltipBorder}`,
            backgroundColor: tooltipBg,
            color: tooltipText,
          }}
          labelStyle={{ color: tooltipText }}
          cursor={{ fill: cursorFill }}
          formatter={(v) => [v, yLabel ?? yKey]}
        />
        <Bar dataKey={yKey} fill={barColor} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
