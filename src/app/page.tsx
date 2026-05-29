"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { KpiCard } from "@/components/kpi-card";
import { RevenueAreaChart } from "@/components/charts/sales-chart";
import { HourlyBarChart } from "@/components/charts/traffic-chart";
import { PostureGauge } from "@/components/charts/posture-gauge";
import { SeverityDonut } from "@/components/charts/severity-donut";
import { EventTicker } from "@/components/event-ticker";
import { ThreatHeatStrip } from "@/components/threat-heat-strip";
import { AuditTrail } from "@/components/audit-trail";
import {
  todayKPIs,
  weekVisitors,
  postureTrend,
  assets,
  threats,
  projectMeta,
  severityDistribution,
} from "@/lib/mock-data";
import { formatNumber, cn } from "@/lib/utils";
import {
  ShieldCheck,
  Users,
  AlertOctagon,
  ShieldAlert,
  Activity,
  Radio,
} from "lucide-react";

const severityLegend: { key: string; label: string; light: string; dark: string }[] = [
  { key: "critical", label: "Critical", light: "#dc2626", dark: "#ef4444" },
  { key: "high", label: "High", light: "#ea580c", dark: "#fb923c" },
  { key: "medium", label: "Medium", light: "#d97706", dark: "#f59e0b" },
  { key: "low", label: "Low", light: "#0e7490", dark: "#06b6d4" },
  { key: "info", label: "Info", light: "#64748b", dark: "#94a3b8" },
];

interface LiveResult {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage";
  httpStatus: number | null;
  responseMs: number | null;
}

const statusColor: Record<string, string> = {
  operational: "text-emerald-500",
  degraded: "text-amber-500",
  outage: "text-red-500",
};

const statusBg: Record<string, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-red-500",
};

export default function OverviewPage() {
  const [live, setLive] = useState<LiveResult[] | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/health-check", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setLive(data.results);
          setLastChecked(new Date(data.checkedAt).toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour12: false }));
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHealth();
    const t = setInterval(fetchHealth, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const criticalThreats = threats.filter((t) => t.severity === "critical" || t.severity === "high");
  const liveOk = live?.filter((r) => r.status === "operational").length ?? 0;
  const liveDegraded = live?.filter((r) => r.status === "degraded").length ?? 0;
  const liveOutage = live?.filter((r) => r.status === "outage").length ?? 0;

  return (
    <>
      <Topbar
        title="Security Operations"
        subtitle={`${projectMeta.codename} · ${projectMeta.region} · ${new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <EventTicker />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Posture Score"
            value={`${todayKPIs.postureScore}/100`}
            countTo={todayKPIs.postureScore}
            format={(n) => `${Math.round(n)}/100`}
            delta={todayKPIs.postureDelta}
            hint="rolling 30d"
            icon={ShieldCheck}
          />
          <KpiCard
            label="Visitors Today"
            value={formatNumber(todayKPIs.visitorsToday)}
            countTo={todayKPIs.visitorsToday}
            format={(n) => formatNumber(Math.round(n))}
            delta={todayKPIs.visitorsDeltaPct}
            hint="across all sites"
            icon={Users}
          />
          <KpiCard
            label="Active Alerts"
            value={todayKPIs.activeAlerts.toString()}
            countTo={todayKPIs.activeAlerts}
            format={(n) => Math.round(n).toString()}
            hint={`${todayKPIs.criticalAlerts} critical`}
            icon={AlertOctagon}
            alert={todayKPIs.criticalAlerts > 0}
          />
          <KpiCard
            label="Attacks Blocked"
            value={formatNumber(todayKPIs.blockedAttacks24h)}
            countTo={todayKPIs.blockedAttacks24h}
            format={(n) => formatNumber(Math.round(n))}
            delta={todayKPIs.blockedDeltaPct}
            hint="last 24h"
            icon={ShieldAlert}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Security posture</h2>
            <p className="text-xs text-muted mb-2">Composite score · rolling 30d</p>
            <PostureGauge score={todayKPIs.postureScore} />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Threat severity mix</h2>
            <p className="text-xs text-muted mb-2">Last 24h events</p>
            <SeverityDonut data={severityDistribution} />
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
              {severityLegend.map((s) => {
                const count = severityDistribution.find((d) => d.severity === s.key)?.count ?? 0;
                if (count === 0) return null;
                return (
                  <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.light }} />
                    {s.label} <span className="font-mono text-foreground">{count}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Radio size={18} className="text-red-500" />
              <h2 className="font-semibold text-lg text-foreground">High-severity feed</h2>
            </div>
            <p className="text-xs text-muted mb-4">Critical + high · last 24h</p>
            <ul className="space-y-3">
              {criticalThreats.slice(0, 4).map((t) => (
                <li key={t.id} className="flex items-start gap-3">
                  <div className={cn("w-1 self-stretch rounded-full", t.severity === "critical" ? "bg-red-500" : "bg-amber-500")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={cn("text-[10px] uppercase tracking-wider font-bold font-mono", t.severity === "critical" ? "text-red-500" : "text-amber-500")}>
                        {t.severity}
                      </span>
                      <span className="text-xs text-muted font-mono">{t.ts}</span>
                    </div>
                    <div className="text-sm font-medium text-foreground truncate">{t.category} · {t.asset}</div>
                    <div className="text-xs text-muted truncate">{t.ip} · {t.country}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", liveOutage > 0 ? "bg-red-500 animate-ping" : liveDegraded > 0 ? "bg-amber-500 animate-ping" : "bg-emerald-500 animate-ping")} />
                  <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", liveOutage > 0 ? "bg-red-500" : liveDegraded > 0 ? "bg-amber-500" : "bg-emerald-500")} />
                </span>
                Live monitored sites
                <span className="font-mono text-xs text-sentinel-cyan uppercase tracking-widest">· real ping</span>
              </h2>
              <p className="text-xs text-muted">
                Direct HTTP HEAD from Vercel edge · refresh 60s
                {lastChecked && ` · last check ${lastChecked} PHT`}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {liveOk} OK</div>
              {liveDegraded > 0 && <div className="flex items-center gap-1.5 text-amber-500"><div className="w-2 h-2 rounded-full bg-amber-500" /> {liveDegraded} slow</div>}
              {liveOutage > 0 && <div className="flex items-center gap-1.5 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500" /> {liveOutage} down</div>}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-lg bg-background border border-border space-y-2">
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-6 w-1/2 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(live ?? []).map((r) => (
                <div key={r.id} className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-foreground text-sm truncate">{r.name}</div>
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0 ml-2", statusBg[r.status])} />
                  </div>
                  <div className={cn("text-2xl font-bold tabular-nums mb-1", statusColor[r.status])}>
                    {r.httpStatus ?? "—"}
                    {r.status === "operational" && <span className="text-sm font-medium text-muted ml-2">OK</span>}
                    {r.status === "degraded" && <span className="text-sm font-medium text-amber-500 ml-2">SLOW</span>}
                    {r.status === "outage" && <span className="text-sm font-medium text-red-500 ml-2">DOWN</span>}
                  </div>
                  <div className="text-xs text-muted font-mono">
                    {r.responseMs ? `${r.responseMs}ms` : "no response"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Visitor traffic this week</h2>
                <p className="text-xs text-muted">Combined across 3 dashboards</p>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-full bg-sentinel-cyan/15 text-sentinel-cyan font-semibold inline-flex items-center gap-1 font-mono uppercase tracking-wide">
                <Activity size={12} /> Sentinel watch
              </div>
            </div>
            <RevenueAreaChart data={weekVisitors} xKey="day" yKey="visitors" formatter={(v) => formatNumber(v)} />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Attacks blocked — 7d</h2>
            <p className="text-xs text-muted mb-4">WAF + rate-limit + bot challenges</p>
            <HourlyBarChart data={weekVisitors} xKey="day" yKey="attacksBlocked" yLabel="blocked" color="red" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Threat activity by hour</h2>
            <p className="text-xs text-muted mb-4">When attacks hit · UTC offset Asia/Manila</p>
            <ThreatHeatStrip />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-lg text-foreground mb-1">Posture trend</h2>
            <p className="text-xs text-muted mb-4">5-week security score</p>
            <div className="space-y-3">
              {postureTrend.map((p, i) => {
                const isLatest = i === postureTrend.length - 1;
                return (
                  <div key={p.week}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className={cn("font-mono", isLatest ? "text-sentinel-cyan font-bold" : "text-muted")}>
                        {p.week}
                      </span>
                      <span className={cn("font-bold tabular-nums", isLatest ? "text-foreground" : "text-muted")}>
                        {p.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isLatest ? "bg-sentinel-cyan" : "bg-sentinel-cyan/40"
                        )}
                        style={{ width: `${p.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-semibold text-lg text-foreground">Monitored asset summary</h2>
              <p className="text-xs text-muted">{todayKPIs.assetsOperational} of {todayKPIs.assetsMonitored} operational · {todayKPIs.uptime30d}% uptime 30d</p>
            </div>
            <div className="text-xs text-muted font-mono">{formatNumber(todayKPIs.apiCallsToday)} API calls · ${todayKPIs.apiCostToday.toFixed(2)} today</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(["website", "vps", "api", "github", "domain"] as const).map((kind) => {
              const count = assets.filter((a) => a.kind === kind).length;
              const ok = assets.filter((a) => a.kind === kind && a.status === "operational").length;
              return (
                <div key={kind} className="p-3 rounded-lg bg-background border border-border">
                  <div className="text-xs text-muted uppercase tracking-wide font-mono">{kind}</div>
                  <div className="text-xl font-bold text-foreground tabular-nums">
                    {ok}<span className="text-base text-muted">/{count}</span>
                  </div>
                  <div className="text-xs text-emerald-500 font-semibold">healthy</div>
                </div>
              );
            })}
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="text-xs text-muted uppercase tracking-wide font-mono">total</div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                {todayKPIs.assetsOperational}<span className="text-base text-muted">/{todayKPIs.assetsMonitored}</span>
              </div>
              <div className="text-xs text-sentinel-cyan font-semibold">{todayKPIs.uptime30d}% up</div>
            </div>
          </div>
        </div>

        <AuditTrail />
      </main>
    </>
  );
}
