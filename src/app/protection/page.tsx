"use client";

import { useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { KpiCard } from "@/components/kpi-card";
import { SortableTH } from "@/components/sortable-th";
import { useApp } from "@/lib/app-provider";
import { useTableSort } from "@/lib/use-table-sort";
import { githubRepos, brandMentions, type BrandMention } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import { GitFork, Star, Eye, Globe, ExternalLink, ShieldAlert, FileWarning, GitBranch, Wifi } from "lucide-react";

type MKey = "detectedAt" | "source" | "sentiment" | "status" | "matchedTerm" | "similarityScore";

interface LiveRepo {
  name: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  pushedAt: string;
}

const sentimentStyles: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  negative: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  impersonation: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const sourceStyles: Record<string, string> = {
  GitHub: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  Google: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  Twitter: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  Facebook: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  Reddit: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  "TLD scan": "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  Wayback: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

const statusStyles: Record<string, string> = {
  new: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  investigating: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  "dmca-filed": "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  "false-positive": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const pulseStyles: Record<string, string> = {
  healthy: "bg-emerald-500",
  watch: "bg-amber-500",
  flagged: "bg-red-500",
};

const sentimentOrder: Record<string, number> = { impersonation: 0, negative: 1, neutral: 2, positive: 3 };
const statusOrder: Record<string, number> = { new: 0, investigating: 1, "dmca-filed": 2, resolved: 3, "false-positive": 4 };

export default function ProtectionPage() {
  const { search } = useApp();
  const [liveRepos, setLiveRepos] = useState<Record<string, LiveRepo>>({});
  const [ghLive, setGhLive] = useState<"loading" | "live" | "offline">("loading");
  const [ghFetchedAt, setGhFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github-stats", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.ok && Array.isArray(data.repos)) {
          const map: Record<string, LiveRepo> = {};
          for (const r of data.repos as LiveRepo[]) map[r.name] = r;
          setLiveRepos(map);
          setGhLive("live");
          setGhFetchedAt(new Date(data.fetchedAt).toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour12: false }));
        } else {
          setGhLive("offline");
        }
      } catch {
        if (!cancelled) setGhLive("offline");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Merge live GitHub data over the static repo list (keeps suspicious-fork heuristics).
  const repos = useMemo(() => {
    return githubRepos.map((r) => {
      const live = liveRepos[r.name];
      if (!live) return r;
      return {
        ...r,
        stars: live.stars,
        forks: live.forks,
        watchers: live.watchers,
        lastPush: live.pushedAt.slice(0, 10),
        isLive: true as const,
      };
    });
  }, [liveRepos]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brandMentions;
    return brandMentions.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.url.toLowerCase().includes(q) ||
        m.matchedTerm.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q) ||
        m.sentiment.toLowerCase().includes(q)
    );
  }, [search]);

  const accessor = (row: BrandMention, key: MKey) => {
    if (key === "sentiment") return sentimentOrder[row.sentiment];
    if (key === "status") return statusOrder[row.status];
    if (key === "similarityScore") return row.similarityScore ?? 0;
    return row[key] ?? "";
  };

  const { sort, sorted, toggle } = useTableSort<BrandMention, MKey>(
    filtered,
    { key: "sentiment", dir: "asc" },
    accessor
  );

  const impersonations = brandMentions.filter((m) => m.sentiment === "impersonation" && m.status !== "resolved" && m.status !== "false-positive").length;
  const newMentions = brandMentions.filter((m) => m.status === "new").length;
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);
  const suspiciousForks = repos.reduce((s, r) => s + r.suspiciousForks.length, 0);
  const totalStars = repos.reduce((s, r) => s + r.stars, 0);

  return (
    <>
      <Topbar title="Code & Brand Protection" subtitle="GitHub fork monitoring · impersonation watch · brand mentions across the web" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Brand impersonations" value={impersonations.toString()} icon={ShieldAlert} hint="active threats" />
          <KpiCard label="New mentions" value={newMentions.toString()} icon={FileWarning} hint="awaiting review" />
          <KpiCard label="Suspicious forks" value={suspiciousForks.toString()} icon={GitFork} hint="bot-style accounts" />
          <KpiCard label="GitHub stars" value={totalStars.toString()} icon={Star} hint="across repos" />
        </div>

        {impersonations > 0 && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-5">
            <div className="flex items-start gap-3 flex-wrap">
              <ShieldAlert className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-red-900 dark:text-red-200 uppercase tracking-wider text-sm">
                  Active impersonation cases
                </h3>
                <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                  {impersonations} unresolved impersonation flag(s). Review the queue below — confirm typosquat domains, file GitHub takedown requests for verbatim forks, prepare DMCA notices if content scraping is confirmed.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {brandMentions.filter((m) => m.sentiment === "impersonation" && m.status !== "resolved" && m.status !== "false-positive").map((m) => (
                    <span key={m.id} className="bg-white dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full font-mono font-semibold">
                      {m.matchedTerm}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                  File DMCA
                </button>
                <button className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-background text-foreground text-sm font-semibold transition-colors">
                  WHOIS lookup
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                <GitBranch size={18} className="text-sentinel-cyan" />
                GitHub repository pulse
              </h2>
              <p className="text-xs text-muted">{repos.length} repos monitored · {totalForks} total forks · {totalStars} stars · {suspiciousForks} flagged</p>
            </div>
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold font-mono inline-flex items-center gap-1.5",
                ghLive === "live" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                ghLive === "loading" && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                ghLive === "offline" && "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              )}
            >
              <Wifi size={11} />
              {ghLive === "live" && `Live · GitHub API${ghFetchedAt ? ` · ${ghFetchedAt}` : ""}`}
              {ghLive === "loading" && "Fetching live data..."}
              {ghLive === "offline" && "Cached (API rate-limited)"}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {repos.map((repo) => (
              <li key={repo.name} className="px-6 py-4 hover:bg-background/60">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn("w-2 h-2 rounded-full shrink-0", pulseStyles[repo.pulse])} />
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-mono font-semibold text-foreground hover:text-sentinel-cyan transition-colors">
                        {repo.name}
                      </a>
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold",
                        repo.visibility === "public"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      )}>
                        {repo.visibility}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                      <span className="flex items-center gap-1"><Star size={12} /> {repo.stars} stars</span>
                      <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks} forks</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {repo.watchers} watchers</span>
                      {repo.newForks24h > 0 && (
                        <span className="text-amber-500 font-semibold">+{repo.newForks24h} fork in last 24h</span>
                      )}
                      <span className="font-mono">last push: {repo.lastPush}</span>
                    </div>
                    {repo.suspiciousForks.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-red-500 font-semibold uppercase tracking-wide font-mono">⚠ Flagged:</span>
                        {repo.suspiciousForks.map((f) => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-mono">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sentinel-cyan hover:text-sentinel-cyan-dark">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Globe size={18} className="text-sentinel-cyan" />
              Brand mention queue
            </h2>
            <p className="text-xs text-muted">
              {formatNumber(sorted.length)} of {formatNumber(brandMentions.length)} mentions
              {search && ` · filtered by "${search}"`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[960px]">
              <thead className="bg-background text-muted text-xs uppercase tracking-wide">
                <tr>
                  <SortableTH field="sentiment" active={sort.key} dir={sort.dir} onToggle={toggle}>Sentiment</SortableTH>
                  <SortableTH field="source" active={sort.key} dir={sort.dir} onToggle={toggle}>Source</SortableTH>
                  <th className="text-left px-6 py-3 font-semibold min-w-[300px]">Match</th>
                  <SortableTH field="matchedTerm" active={sort.key} dir={sort.dir} onToggle={toggle}>Term</SortableTH>
                  <SortableTH field="similarityScore" active={sort.key} dir={sort.dir} onToggle={toggle} align="right">Similarity</SortableTH>
                  <SortableTH field="detectedAt" active={sort.key} dir={sort.dir} onToggle={toggle}>Detected</SortableTH>
                  <SortableTH field="status" active={sort.key} dir={sort.dir} onToggle={toggle}>Status</SortableTH>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted text-sm">
                      Walang mention na tugma sa &ldquo;{search}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  sorted.map((m) => (
                    <tr key={m.id} className="hover:bg-background/60">
                      <td className="px-6 py-3">
                        <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold", sentimentStyles[m.sentiment])}>
                          {m.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", sourceStyles[m.source])}>
                          {m.source}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-foreground leading-snug">{m.title}</div>
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sentinel-cyan font-mono truncate inline-flex items-center gap-1 max-w-[300px] hover:underline">
                          <span className="truncate">{m.url}</span>
                          <ExternalLink size={10} className="shrink-0" />
                        </a>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-muted">{m.matchedTerm}</td>
                      <td className="px-6 py-3 text-right tabular-nums">
                        {m.similarityScore !== undefined ? (
                          <span className={cn(
                            "font-bold",
                            m.similarityScore >= 95 ? "text-red-500" : m.similarityScore >= 80 ? "text-amber-500" : "text-muted"
                          )}>
                            {m.similarityScore}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-3 text-xs text-muted font-mono">{m.detectedAt}</td>
                      <td className="px-6 py-3">
                        <span className={cn("text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold", statusStyles[m.status])}>
                          {m.status}
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
    </>
  );
}
