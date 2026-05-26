"use client";

import { useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { KpiCard } from "@/components/kpi-card";
import { SortableTH } from "@/components/sortable-th";
import { useApp } from "@/lib/app-provider";
import { useTableSort } from "@/lib/use-table-sort";
import { assets, apiUsage, vulnerabilities, type Asset } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import { ServerCog, CheckCircle2, AlertTriangle, ServerCrash, Activity, Cpu } from "lucide-react";

type AKey = "name" | "kind" | "status" | "uptime30d" | "responseMs" | "tier" | "region";

const statusStyles: Record<string, string> = {
  operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  degraded: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  outage: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  unknown: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const tierStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  important: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  standard: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const kindStyles: Record<string, string> = {
  website: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  vps: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  api: "bg-sentinel-cyan/15 text-sentinel-cyan",
  github: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  domain: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
};

const statusOrder: Record<string, number> = { outage: 0, degraded: 1, unknown: 2, operational: 3 };

const vulnSeverityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  high: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const vulnStatusStyles: Record<string, string> = {
  open: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  "in-progress": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  patched: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  "accepted-risk": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

interface LiveMap { [id: string]: { status: string; responseMs: number | null; httpStatus: number | null } }

export default function AssetsPage() {
  const { search } = useApp();
  const [liveMap, setLiveMap] = useState<LiveMap>({});

  useEffect(() => {
    let cancelled = false;
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/health-check", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const map: LiveMap = {};
        for (const r of data.results) {
          map[r.id] = { status: r.status, responseMs: r.responseMs, httpStatus: r.httpStatus };
        }
        setLiveMap(map);
      } catch { /* ignore */ }
    };
    fetchHealth();
    const t = setInterval(fetchHealth, 60_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const enrichedAssets = useMemo(() => {
    return assets.map((a) => {
      if (a.liveCheck && liveMap[a.id]) {
        const live = liveMap[a.id];
        return {
          ...a,
          status: live.status as Asset["status"],
          responseMs: live.responseMs,
          lastCheckedAt: "just now",
        };
      }
      return a;
    });
  }, [liveMap]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enrichedAssets;
    return enrichedAssets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.kind.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        (a.url?.toLowerCase().includes(q) ?? false) ||
        a.status.toLowerCase().includes(q)
    );
  }, [enrichedAssets, search]);

  const accessor = (row: Asset, key: AKey) => {
    if (key === "status") return statusOrder[row.status];
    if (key === "responseMs") return row.responseMs ?? Number.MAX_SAFE_INTEGER;
    return row[key] ?? "";
  };

  const { sort, sorted, toggle } = useTableSort<Asset, AKey>(
    filtered,
    { key: "status", dir: "asc" },
    accessor
  );

  const operational = enrichedAssets.filter((a) => a.status === "operational").length;
  const degraded = enrichedAssets.filter((a) => a.status === "degraded").length;
  const outage = enrichedAssets.filter((a) => a.status === "outage").length;
  const openVulns = vulnerabilities.filter((v) => v.status === "open" || v.status === "in-progress").length;

  return (
    <>
      <Topbar title="Asset Health" subtitle="Websites, VPS, APIs, GitHub, domains — uptime + status + vulnerabilities" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Operational" value={operational.toString()} icon={CheckCircle2} hint={`of ${assets.length} assets`} />
          <KpiCard label="Degraded" value={degraded.toString()} icon={AlertTriangle} hint="elevated latency" />
          <KpiCard label="Outages" value={outage.toString()} icon={ServerCrash} hint="immediate action" />
          <KpiCard label="Open vulnerabilities" value={openVulns.toString()} icon={Cpu} hint="across stack" />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-baseline gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold text-lg text-foreground">Monitored assets</h2>
              <p className="text-xs text-muted">
                {formatNumber(sorted.length)} of {formatNumber(assets.length)} assets
                {search && ` · filtered by "${search}"`}
              </p>
            </div>
            <div className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono uppercase tracking-wide font-semibold flex items-center gap-1.5">
              <Activity size={12} /> Live monitoring active
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[920px]">
              <thead className="bg-background text-muted text-xs uppercase tracking-wide">
                <tr>
                  <SortableTH field="name" active={sort.key} dir={sort.dir} onToggle={toggle}>Asset</SortableTH>
                  <SortableTH field="kind" active={sort.key} dir={sort.dir} onToggle={toggle}>Type</SortableTH>
                  <SortableTH field="status" active={sort.key} dir={sort.dir} onToggle={toggle}>Status</SortableTH>
                  <SortableTH field="responseMs" active={sort.key} dir={sort.dir} onToggle={toggle} align="right">Response</SortableTH>
                  <SortableTH field="uptime30d" active={sort.key} dir={sort.dir} onToggle={toggle} align="right">Uptime 30d</SortableTH>
                  <SortableTH field="tier" active={sort.key} dir={sort.dir} onToggle={toggle}>Tier</SortableTH>
                  <SortableTH field="region" active={sort.key} dir={sort.dir} onToggle={toggle}>Region</SortableTH>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted text-sm">
                      Walang asset na tugma sa &ldquo;{search}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  sorted.map((a) => (
                    <tr key={a.id} className="hover:bg-background/60">
                      <td className="px-6 py-3">
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {a.liveCheck && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Real ping" />}
                          {a.name}
                        </div>
                        {a.url && <div className="text-xs text-muted font-mono truncate max-w-[280px]">{a.url}</div>}
                        {a.notes && <div className="text-[11px] text-muted italic mt-0.5">{a.notes}</div>}
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold uppercase font-mono", kindStyles[a.kind])}>
                          {a.kind}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", statusStyles[a.status])}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums font-mono text-foreground">
                        {a.responseMs !== null ? `${a.responseMs}ms` : "—"}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-foreground">
                        {a.uptime30d > 0 ? `${a.uptime30d.toFixed(2)}%` : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold uppercase", tierStyles[a.tier])}>
                          {a.tier}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-muted">{a.region}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">API usage & spend</h2>
            <p className="text-xs text-muted mb-4">Today&apos;s calls, cost, rate-limit headroom</p>
            <ul className="space-y-3">
              {apiUsage.map((api) => (
                <li key={api.provider} className="p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-baseline justify-between mb-1.5 gap-2 flex-wrap">
                    <div className="font-medium text-foreground text-sm">{api.provider}</div>
                    <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold font-mono", statusStyles[api.status])}>
                      {api.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 flex-wrap text-xs mb-2">
                    <span className="font-mono text-foreground">{formatNumber(api.callsToday)} calls</span>
                    <span className="text-muted">·</span>
                    <span className="font-mono text-foreground">${api.costToday.toFixed(2)} today</span>
                    <span className="text-muted">·</span>
                    <span className="font-mono text-muted">${api.costMonth.toFixed(0)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted w-16 font-mono">RATE</span>
                    <div className="flex-1 bg-card rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          api.rateLimitUsedPct >= 80 ? "bg-red-500" : api.rateLimitUsedPct >= 50 ? "bg-amber-500" : "bg-sentinel-cyan"
                        )}
                        style={{ width: `${api.rateLimitUsedPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted tabular-nums w-10 text-right">{api.rateLimitUsedPct}%</span>
                  </div>
                  {api.lastError && (
                    <div className="mt-2 text-[10px] text-red-500 font-mono">⚠ {api.lastError}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Open vulnerabilities</h2>
            <p className="text-xs text-muted mb-4">Across stack · sorted by severity</p>
            <ul className="space-y-3">
              {vulnerabilities.map((v) => (
                <li key={v.id} className="p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold font-mono", vulnSeverityStyles[v.severity])}>
                        {v.severity}
                      </span>
                      <span className="font-mono text-xs text-muted">{v.id}</span>
                      {v.cve && <span className="font-mono text-xs text-sentinel-cyan">{v.cve}</span>}
                    </div>
                    <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold", vulnStatusStyles[v.status])}>
                      {v.status}
                    </span>
                  </div>
                  <div className="text-sm text-foreground leading-snug mt-1">{v.title}</div>
                  <div className="text-[11px] text-muted mt-1 flex items-center gap-2">
                    <ServerCog size={11} /> {v.asset} · detected {v.detectedAt}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
