"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { KpiCard } from "@/components/kpi-card";
import { SortableTH } from "@/components/sortable-th";
import { IncidentDrawer } from "@/components/incident-drawer";
import { ThreatHeatStrip } from "@/components/threat-heat-strip";
import { useApp } from "@/lib/app-provider";
import { useTableSort } from "@/lib/use-table-sort";
import { threats, todayKPIs, type ThreatEvent } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import { ShieldAlert, AlertOctagon, Ban, Eye } from "lucide-react";

type TKey = "ts" | "asset" | "category" | "severity" | "ip" | "country" | "status" | "action";

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-300 dark:border-red-900/60",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300 dark:border-orange-900/60",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-900/60",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300 dark:border-sky-900/60",
  info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700",
};

const statusStyles: Record<string, string> = {
  open: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  investigating: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  mitigated: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const actionStyles: Record<string, string> = {
  blocked: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  challenged: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  "rate-limited": "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  logged: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
const statusOrder: Record<string, number> = { open: 0, investigating: 1, mitigated: 2, resolved: 3 };

export default function ThreatsPage() {
  const { search } = useApp();
  const [selected, setSelected] = useState<ThreatEvent | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threats;
    return threats.filter(
      (t) =>
        t.asset.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.ip.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.severity.toLowerCase().includes(q) ||
        t.details.toLowerCase().includes(q)
    );
  }, [search]);

  const accessor = (row: ThreatEvent, key: TKey) => {
    if (key === "severity") return severityOrder[row.severity];
    if (key === "status") return statusOrder[row.status];
    return row[key];
  };

  const { sort, sorted, toggle } = useTableSort<ThreatEvent, TKey>(
    filtered,
    { key: "severity", dir: "asc" },
    accessor
  );

  const criticalCount = threats.filter((t) => t.severity === "critical").length;
  const highCount = threats.filter((t) => t.severity === "high").length;
  const investigatingCount = threats.filter((t) => t.status === "investigating" || t.status === "open").length;
  const blockedCount = threats.filter((t) => t.action === "blocked").length;

  const byCategory: Record<string, number> = {};
  for (const t of threats) byCategory[t.category] = (byCategory[t.category] ?? 0) + 1;
  const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const byCountry: Record<string, number> = {};
  for (const t of threats) if (t.country !== "—" && t.country !== "Various") byCountry[t.country] = (byCountry[t.country] ?? 0) + 1;
  const topCountries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <>
      <Topbar title="Threats & Incidents" subtitle={`${todayKPIs.blockedAttacks24h.toLocaleString()} attacks blocked in last 24h · WAF + rate-limit + bot challenges`} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Critical events" value={criticalCount.toString()} icon={AlertOctagon} hint="immediate response" />
          <KpiCard label="High severity" value={highCount.toString()} icon={ShieldAlert} hint="elevated risk" />
          <KpiCard label="Investigating" value={investigatingCount.toString()} icon={Eye} hint="SOC queue" />
          <KpiCard label="Blocked actions" value={blockedCount.toString()} icon={Ban} hint="auto-mitigated" />
        </div>

        {criticalCount > 0 && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-5">
            <div className="flex items-start gap-3 flex-wrap">
              <AlertOctagon className="text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-red-900 dark:text-red-200 uppercase tracking-wider text-sm flex items-center gap-2">
                  Active Critical Incident
                </h3>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  Credential stuffing burst against n8n instance from Tor exit node. WAF block engaged automatically. <strong>Manual review required</strong> — verify no successful breach occurred, rotate any exposed credentials, consider geo-IP block.
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shrink-0 transition-colors">
                Open runbook
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Top attack categories</h2>
            <p className="text-xs text-muted mb-4">Last 24h event types</p>
            <ul className="space-y-3">
              {topCategories.map(([category, count]) => {
                const max = topCategories[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <li key={category}>
                    <div className="flex items-center justify-between text-sm mb-1.5 gap-2">
                      <span className="text-foreground truncate">{category}</span>
                      <span className="font-bold text-foreground tabular-nums shrink-0">{count}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Attack origin countries</h2>
            <p className="text-xs text-muted mb-4">Where blocked traffic came from</p>
            <ul className="space-y-3">
              {topCountries.map(([country, count]) => {
                const max = topCountries[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <li key={country}>
                    <div className="flex items-center justify-between text-sm mb-1.5 gap-2">
                      <span className="text-foreground truncate">{country}</span>
                      <span className="font-bold text-foreground tabular-nums shrink-0">{count}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-lg text-foreground mb-1">Threat activity by hour</h2>
          <p className="text-xs text-muted mb-4">24h distribution of detected events — overnight peak typical of automated scanners</p>
          <ThreatHeatStrip />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-lg text-foreground">Event log</h2>
            <p className="text-xs text-muted">
              {formatNumber(sorted.length)} of {formatNumber(threats.length)} events
              {search && ` · filtered by "${search}"`}
              {" · "}<span className="text-sentinel-cyan">click a row for forensic detail</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1080px]">
              <thead className="bg-background text-muted text-xs uppercase tracking-wide">
                <tr>
                  <SortableTH field="severity" active={sort.key} dir={sort.dir} onToggle={toggle}>Severity</SortableTH>
                  <SortableTH field="ts" active={sort.key} dir={sort.dir} onToggle={toggle}>Time</SortableTH>
                  <SortableTH field="asset" active={sort.key} dir={sort.dir} onToggle={toggle}>Asset</SortableTH>
                  <SortableTH field="category" active={sort.key} dir={sort.dir} onToggle={toggle}>Category</SortableTH>
                  <SortableTH field="ip" active={sort.key} dir={sort.dir} onToggle={toggle}>Source IP</SortableTH>
                  <SortableTH field="country" active={sort.key} dir={sort.dir} onToggle={toggle}>Origin</SortableTH>
                  <th className="text-left px-6 py-3 font-semibold min-w-[260px]">Details</th>
                  <SortableTH field="action" active={sort.key} dir={sort.dir} onToggle={toggle}>Action</SortableTH>
                  <SortableTH field="status" active={sort.key} dir={sort.dir} onToggle={toggle}>Status</SortableTH>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-muted text-sm">
                      Walang event na tugma sa &ldquo;{search}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  sorted.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="hover:bg-sentinel-cyan/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-3">
                        <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold font-mono border", severityStyles[t.severity])}>
                          {t.severity}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-foreground tabular-nums">{t.ts}</td>
                      <td className="px-6 py-3 text-foreground">{t.asset}</td>
                      <td className="px-6 py-3 text-foreground text-xs font-medium">{t.category}</td>
                      <td className="px-6 py-3 font-mono text-xs text-muted">{t.ip}</td>
                      <td className="px-6 py-3 text-xs text-muted">{t.country}</td>
                      <td className="px-6 py-3 text-xs text-foreground leading-relaxed">{t.details}</td>
                      <td className="px-6 py-3">
                        <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold", actionStyles[t.action])}>
                          {t.action}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold", statusStyles[t.status])}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <IncidentDrawer event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
