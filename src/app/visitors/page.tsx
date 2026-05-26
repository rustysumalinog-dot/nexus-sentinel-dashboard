"use client";

import { Topbar } from "@/components/topbar";
import { KpiCard } from "@/components/kpi-card";
import { RevenueAreaChart } from "@/components/charts/sales-chart";
import {
  todayKPIs,
  weekVisitors,
  visitorStats,
  topCountries,
  topReferrers,
  deviceSplit,
} from "@/lib/mock-data";
import { formatNumber, cn } from "@/lib/utils";
import { Users, Globe, MousePointer2, Smartphone, ExternalLink, Clock, Info } from "lucide-react";

export default function VisitorsPage() {
  // Exclude sites with no analytics installed from the averages (otherwise zeros skew the mean).
  const tracked = visitorStats.filter((v) => v.visitors7d > 0);
  const totalVisitors7d = tracked.reduce((s, v) => s + v.visitors7d, 0);
  const avgBounce = tracked.length > 0 ? Math.round(tracked.reduce((s, v) => s + v.bounceRate, 0) / tracked.length) : 0;
  const avgDuration = tracked.length > 0 ? Math.round(tracked.reduce((s, v) => s + v.avgDurationSec, 0) / tracked.length) : 0;
  const untrackedSites = visitorStats.filter((v) => v.visitors7d === 0);

  return (
    <>
      <Topbar title="Visitor Analytics" subtitle="Pageviews, geo, referrers, devices — across all monitored sites" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {untrackedSites.length > 0 && (
          <div className="bg-sentinel-cyan/10 border border-sentinel-cyan/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3 flex-wrap">
              <Info className="text-sentinel-cyan shrink-0 mt-0.5" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sentinel-cyan uppercase tracking-wider text-sm">
                  Analytics not yet installed
                </h3>
                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {untrackedSites.length} site(s) currently show <code className="px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono">no analytics</code> because no tracker is installed:{" "}
                  <strong>{untrackedSites.map((s) => s.site).join(", ")}</strong>.
                  Uptime ping is live, pero visitor count is unavailable hangga&apos;t hindi nakakabit ang analytics.
                </p>
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-sentinel-cyan hover:underline">
                    Paano i-enable ang real visitor tracking →
                  </summary>
                  <div className="mt-3 space-y-2 text-xs text-muted leading-relaxed">
                    <div>
                      <strong className="text-foreground">Option A — Plausible (recommended, ₱400/mo):</strong> Privacy-first, no cookies, GDPR-ready.
                      Add their <code className="px-1 rounded bg-background border border-border font-mono">{`<script defer data-domain="rustysumalinog.onrender.com" src="https://plausible.io/js/script.js" />`}</code> sa <code className="px-1 rounded bg-background border border-border font-mono">&lt;head&gt;</code> ng portfolio. Then I wire their REST API into <code className="px-1 rounded bg-background border border-border font-mono">/api/visitor-stats</code> here.
                    </div>
                    <div>
                      <strong className="text-foreground">Option B — Umami (self-hosted, free):</strong> Run umami on your Hostinger VPS via n8n or Docker. Add their script tag to the portfolio. Free forever.
                    </div>
                    <div>
                      <strong className="text-foreground">Option C — Vercel/Render Analytics:</strong> Render doesn&apos;t ship native analytics on free tier. Vercel has built-in Analytics (₱500/mo Pro) if you redeploy the portfolio to Vercel.
                    </div>
                    <div>
                      <strong className="text-foreground">Option D — Google Analytics 4 (free, but heavier):</strong> Standard but cookie-based. Add GA4 measurement ID. Privacy considerations sa PH Data Privacy Act.
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Visitors today" value={formatNumber(todayKPIs.visitorsToday)} delta={todayKPIs.visitorsDeltaPct} icon={Users} hint={`${tracked.length} tracked sites`} />
          <KpiCard label="Visitors 7d" value={formatNumber(totalVisitors7d)} icon={Globe} hint="rolling week" />
          <KpiCard label="Bounce rate" value={`${avgBounce}%`} icon={MousePointer2} hint="avg across sites" invertDelta />
          <KpiCard label="Avg. session" value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`} icon={Clock} hint="time on site" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
            <div>
              <h2 className="font-semibold text-lg text-foreground">Visitors this week</h2>
              <p className="text-xs text-muted">Combined unique visitors · 3 dashboards</p>
            </div>
          </div>
          <RevenueAreaChart data={weekVisitors} xKey="day" yKey="visitors" formatter={(v) => formatNumber(v)} />
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-lg text-foreground">By site — performance breakdown</h2>
            <p className="text-xs text-muted">Per-property visitor metrics</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="bg-background text-muted text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Site</th>
                  <th className="text-right px-6 py-3 font-semibold">Today</th>
                  <th className="text-right px-6 py-3 font-semibold">7-day</th>
                  <th className="text-right px-6 py-3 font-semibold">Pageviews</th>
                  <th className="text-right px-6 py-3 font-semibold">Avg. dur.</th>
                  <th className="text-right px-6 py-3 font-semibold">Bounce</th>
                  <th className="text-left px-6 py-3 font-semibold">Top country</th>
                  <th className="text-left px-6 py-3 font-semibold">Top referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visitorStats.map((v) => {
                  const untracked = v.visitors7d === 0;
                  if (untracked) {
                    return (
                      <tr key={v.site} className="hover:bg-background/60 italic opacity-70">
                        <td className="px-6 py-3 font-medium text-foreground not-italic">{v.site}</td>
                        <td colSpan={7} className="px-6 py-3 text-sm text-muted">
                          No analytics tracker installed yet · uptime monitored, visitor data unavailable
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={v.site} className="hover:bg-background/60">
                      <td className="px-6 py-3 font-medium text-foreground">{v.site}</td>
                      <td className="px-6 py-3 text-right tabular-nums font-semibold text-foreground">
                        {formatNumber(v.visitorsToday)}
                        <span className="ml-1 text-[10px] text-emerald-500 font-mono">+{v.deltaPct.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-muted">{formatNumber(v.visitors7d)}</td>
                      <td className="px-6 py-3 text-right tabular-nums text-foreground">{formatNumber(v.pageviewsToday)}</td>
                      <td className="px-6 py-3 text-right tabular-nums text-muted font-mono">
                        {Math.floor(v.avgDurationSec / 60)}:{(v.avgDurationSec % 60).toString().padStart(2, "0")}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-muted">{v.bounceRate}%</td>
                      <td className="px-6 py-3 text-foreground">{v.topCountry}</td>
                      <td className="px-6 py-3 text-foreground">{v.topReferrer}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={18} className="text-sentinel-cyan" />
              <h2 className="font-semibold text-lg text-foreground">Top countries</h2>
            </div>
            <p className="text-xs text-muted mb-4">Today&apos;s visitor origin</p>
            <ul className="space-y-2.5">
              {topCountries.map((c) => (
                <li key={c.country}>
                  <div className="flex items-center justify-between text-sm mb-1 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{c.flag}</span>
                      <span className="text-foreground truncate">{c.country}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className="font-bold text-foreground tabular-nums">{c.visitors}</span>
                      <span className="text-xs text-muted tabular-nums">{c.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-sentinel-cyan" style={{ width: `${c.pct * 2.5}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <ExternalLink size={18} className="text-sentinel-cyan" />
              <h2 className="font-semibold text-lg text-foreground">Top referrers</h2>
            </div>
            <p className="text-xs text-muted mb-4">Where they came from</p>
            <ul className="space-y-2.5">
              {topReferrers.map((r) => (
                <li key={r.source}>
                  <div className="flex items-center justify-between text-sm mb-1 gap-2">
                    <span className="text-foreground truncate">{r.source}</span>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className="font-bold text-foreground tabular-nums">{r.visitors}</span>
                      <span className="text-xs text-muted tabular-nums">{r.pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${r.pct * 3}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={18} className="text-sentinel-cyan" />
              <h2 className="font-semibold text-lg text-foreground">Device split</h2>
            </div>
            <p className="text-xs text-muted mb-4">Today&apos;s sessions</p>
            <div className="space-y-4">
              {deviceSplit.map((d) => (
                <div key={d.type}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium text-foreground">{d.type}</span>
                    <span className="font-bold text-foreground tabular-nums">{d.pct}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        d.type === "Mobile" && "bg-sentinel-cyan",
                        d.type === "Desktop" && "bg-purple-500",
                        d.type === "Tablet" && "bg-amber-500"
                      )}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-xs text-muted mb-1">Privacy posture</div>
              <div className="text-sm text-foreground font-medium">Cookie-less analytics · GDPR-compliant</div>
              <div className="text-[11px] text-muted mt-1">No PII stored · IP hashed at edge</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
