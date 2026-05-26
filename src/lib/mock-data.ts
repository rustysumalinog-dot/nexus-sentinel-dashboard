export type AssetKind = "website" | "vps" | "api" | "github" | "domain";
export type AssetStatus = "operational" | "degraded" | "outage" | "unknown";
export type ThreatSeverity = "info" | "low" | "medium" | "high" | "critical";
export type ThreatStatus = "open" | "investigating" | "mitigated" | "resolved";
export type MentionSentiment = "positive" | "neutral" | "negative" | "impersonation";

export interface Operator {
  name: string;
  alias: string;
  role: string;
  clearance: string;
}

export interface SentinelKPIs {
  postureScore: number;
  postureDelta: number;
  visitorsToday: number;
  visitorsDeltaPct: number;
  activeAlerts: number;
  criticalAlerts: number;
  blockedAttacks24h: number;
  blockedDeltaPct: number;
  assetsMonitored: number;
  assetsOperational: number;
  uptime30d: number;
  apiCallsToday: number;
  apiCostToday: number;
}

export interface Asset {
  id: string;
  name: string;
  kind: AssetKind;
  url?: string;
  status: AssetStatus;
  uptime30d: number;
  lastCheckedAt: string;
  responseMs: number | null;
  tier: "critical" | "important" | "standard";
  region: string;
  notes?: string;
  liveCheck?: boolean;
}

export interface VisitorStat {
  site: string;
  visitorsToday: number;
  visitors7d: number;
  pageviewsToday: number;
  avgDurationSec: number;
  bounceRate: number;
  topCountry: string;
  topReferrer: string;
  deltaPct: number;
}

export interface GeoVisitor {
  country: string;
  flag: string;
  visitors: number;
  pct: number;
}

export interface Referrer {
  source: string;
  visitors: number;
  pct: number;
}

export interface Device {
  type: "Desktop" | "Mobile" | "Tablet";
  pct: number;
}

export interface ThreatEvent {
  id: string;
  ts: string;
  asset: string;
  category: "Failed login" | "Bot scan" | "SQL injection" | "Rate limit" | "Geo anomaly" | "CSP violation" | "API abuse" | "DDoS" | "Path traversal" | "Credential stuffing";
  severity: ThreatSeverity;
  ip: string;
  country: string;
  details: string;
  status: ThreatStatus;
  action: "blocked" | "challenged" | "logged" | "rate-limited";
}

export interface VulnerabilityReport {
  id: string;
  asset: string;
  cve?: string;
  title: string;
  severity: ThreatSeverity;
  detectedAt: string;
  status: "patched" | "in-progress" | "open" | "accepted-risk";
}

export interface GithubRepoState {
  name: string;
  url: string;
  visibility: "public" | "private";
  stars: number;
  forks: number;
  watchers: number;
  newForks24h: number;
  lastPush: string;
  pulse: "healthy" | "watch" | "flagged";
  suspiciousForks: string[];
}

export interface BrandMention {
  id: string;
  source: "GitHub" | "Google" | "Twitter" | "Facebook" | "Reddit" | "TLD scan" | "Wayback";
  title: string;
  url: string;
  matchedTerm: string;
  sentiment: MentionSentiment;
  detectedAt: string;
  status: "new" | "investigating" | "dmca-filed" | "false-positive" | "resolved";
  similarityScore?: number;
}

export interface ApiUsage {
  provider: string;
  callsToday: number;
  costToday: number;
  costMonth: number;
  budgetUsedPct: number;
  rateLimitUsedPct: number;
  lastError?: string;
  status: AssetStatus;
}

export const operator: Operator = {
  name: "Rusty Sumalinog",
  alias: "Arkitekto",
  role: "AI Automation Architect",
  clearance: "Owner · Full Access",
};

export const projectMeta = {
  codename: "Project Nexus Sentinel",
  shortName: "Sentinel",
  version: "v0.1.0",
  uplink: "wss://sentinel.rustysumalinog.dev",
  region: "Asia / Manila",
};

export const todayKPIs: SentinelKPIs = {
  postureScore: 87,
  postureDelta: 4,
  visitorsToday: 1842,
  visitorsDeltaPct: 22.4,
  activeAlerts: 6,
  criticalAlerts: 1,
  blockedAttacks24h: 412,
  blockedDeltaPct: 18.2,
  assetsMonitored: 12,
  assetsOperational: 11,
  uptime30d: 99.94,
  apiCallsToday: 8432,
  apiCostToday: 184.5,
};

export const weekVisitors = [
  { day: "Mon", visitors: 824, attacksBlocked: 312 },
  { day: "Tue", visitors: 968, attacksBlocked: 284 },
  { day: "Wed", visitors: 1124, attacksBlocked: 398 },
  { day: "Thu", visitors: 1342, attacksBlocked: 426 },
  { day: "Fri", visitors: 1684, attacksBlocked: 512 },
  { day: "Sat", visitors: 2014, attacksBlocked: 488 },
  { day: "Sun", visitors: 1842, attacksBlocked: 412 },
];

export const postureTrend = [
  { week: "Wk-4", score: 78 },
  { week: "Wk-3", score: 81 },
  { week: "Wk-2", score: 83 },
  { week: "Wk-1", score: 85 },
  { week: "Wk-0", score: 87 },
];

export const assets: Asset[] = [
  // Live-pingable Vercel sites
  { id: "AST-001", name: "Dzong Cafe & Grill", kind: "website", url: "https://dzong.vercel.app", status: "operational", uptime30d: 99.98, lastCheckedAt: "live", responseMs: null, tier: "critical", region: "Vercel Edge / SIN", liveCheck: true },
  { id: "AST-002", name: "Islaura Hotel — Siargao", kind: "website", url: "https://islaura.vercel.app", status: "operational", uptime30d: 99.92, lastCheckedAt: "live", responseMs: null, tier: "critical", region: "Vercel Edge / SIN", liveCheck: true },
  { id: "AST-003", name: "Islaura Resort — El Nido", kind: "website", url: "https://islaura-resort.vercel.app", status: "operational", uptime30d: 99.88, lastCheckedAt: "live", responseMs: null, tier: "critical", region: "Vercel Edge / SIN", liveCheck: true },
  // Other monitored assets (mock)
  { id: "AST-004", name: "Portfolio Website", kind: "website", url: "https://rustysumalinog.dev", status: "unknown", uptime30d: 0, lastCheckedAt: "—", responseMs: null, tier: "important", region: "Pending deploy", notes: "Domain reserved, deploy pending" },
  { id: "AST-005", name: "n8n Instance", kind: "vps", url: "https://n8n.rustysumalinog.dev", status: "operational", uptime30d: 99.74, lastCheckedAt: "2m ago", responseMs: 184, tier: "critical", region: "Hostinger VPS / SG", notes: "16 active workflows · 482 executions today" },
  { id: "AST-006", name: "Supabase Project — Dzong", kind: "api", url: "https://api.supabase.com", status: "operational", uptime30d: 99.99, lastCheckedAt: "1m ago", responseMs: 92, tier: "critical", region: "Supabase SIN", notes: "Pro tier · PITR enabled" },
  { id: "AST-007", name: "Anthropic API (Claude)", kind: "api", url: "https://api.anthropic.com", status: "operational", uptime30d: 99.97, lastCheckedAt: "1m ago", responseMs: 248, tier: "critical", region: "Global edge" },
  { id: "AST-008", name: "OpenAI API (fallback)", kind: "api", url: "https://api.openai.com", status: "degraded", uptime30d: 99.42, lastCheckedAt: "3m ago", responseMs: 1842, tier: "standard", region: "US-East", notes: "Elevated latency · monitoring" },
  { id: "AST-009", name: "GoHighLevel CRM", kind: "api", url: "https://api.gohighlevel.com", status: "operational", uptime30d: 99.91, lastCheckedAt: "2m ago", responseMs: 312, tier: "important", region: "US" },
  { id: "AST-010", name: "PayMongo Payments", kind: "api", url: "https://api.paymongo.com", status: "operational", uptime30d: 99.95, lastCheckedAt: "2m ago", responseMs: 198, tier: "important", region: "PH", notes: "Test mode only" },
  { id: "AST-011", name: "Domain — rustysumalinog.dev", kind: "domain", url: "https://rustysumalinog.dev", status: "operational", uptime30d: 100, lastCheckedAt: "12h ago", responseMs: null, tier: "important", region: "Namecheap", notes: "Expires 2027-03-14 · DNSSEC enabled" },
  { id: "AST-012", name: "GitHub Org — rustysumalinog-dot", kind: "github", url: "https://github.com/rustysumalinog-dot", status: "operational", uptime30d: 100, lastCheckedAt: "5m ago", responseMs: null, tier: "important", region: "GitHub Global", notes: "5 public · 0 private · 2FA enforced" },
];

export const visitorStats: VisitorStat[] = [
  { site: "Dzong Cafe & Grill", visitorsToday: 684, visitors7d: 4128, pageviewsToday: 1842, avgDurationSec: 218, bounceRate: 32, topCountry: "Philippines", topReferrer: "LinkedIn", deltaPct: 18.4 },
  { site: "Islaura Hotel — Siargao", visitorsToday: 612, visitors7d: 3284, pageviewsToday: 1496, avgDurationSec: 196, bounceRate: 28, topCountry: "Philippines", topReferrer: "Direct", deltaPct: 24.6 },
  { site: "Islaura Resort — El Nido", visitorsToday: 546, visitors7d: 2980, pageviewsToday: 1248, avgDurationSec: 248, bounceRate: 24, topCountry: "United States", topReferrer: "LinkedIn", deltaPct: 32.1 },
];

export const topCountries: GeoVisitor[] = [
  { country: "Philippines", flag: "🇵🇭", visitors: 684, pct: 37.1 },
  { country: "United States", flag: "🇺🇸", visitors: 312, pct: 16.9 },
  { country: "Singapore", flag: "🇸🇬", visitors: 184, pct: 10.0 },
  { country: "Australia", flag: "🇦🇺", visitors: 142, pct: 7.7 },
  { country: "United Kingdom", flag: "🇬🇧", visitors: 98, pct: 5.3 },
  { country: "Japan", flag: "🇯🇵", visitors: 84, pct: 4.6 },
  { country: "South Korea", flag: "🇰🇷", visitors: 72, pct: 3.9 },
  { country: "Germany", flag: "🇩🇪", visitors: 58, pct: 3.1 },
  { country: "Canada", flag: "🇨🇦", visitors: 46, pct: 2.5 },
  { country: "Other (34 countries)", flag: "🌐", visitors: 162, pct: 8.9 },
];

export const topReferrers: Referrer[] = [
  { source: "LinkedIn", visitors: 524, pct: 28.4 },
  { source: "Direct / Bookmark", visitors: 412, pct: 22.4 },
  { source: "Google Search", visitors: 296, pct: 16.1 },
  { source: "Facebook", visitors: 184, pct: 10.0 },
  { source: "Twitter / X", visitors: 142, pct: 7.7 },
  { source: "GitHub", visitors: 98, pct: 5.3 },
  { source: "Reddit", visitors: 64, pct: 3.5 },
  { source: "Other", visitors: 122, pct: 6.6 },
];

export const deviceSplit: Device[] = [
  { type: "Mobile", pct: 58 },
  { type: "Desktop", pct: 36 },
  { type: "Tablet", pct: 6 },
];

export const threats: ThreatEvent[] = [
  { id: "EVT-7842", ts: "11:48 AM", asset: "n8n Instance", category: "Credential stuffing", severity: "critical", ip: "185.220.101.42", country: "Russia", details: "248 login attempts in 5 minutes from Tor exit node — blocked at WAF level. Account lockout triggered.", status: "investigating", action: "blocked" },
  { id: "EVT-7841", ts: "11:32 AM", asset: "Dzong Cafe & Grill", category: "Bot scan", severity: "low", ip: "164.92.244.18", country: "Netherlands", details: "Automated scanner probing /admin, /.env, /wp-login.php — all 404. Identified as Censys / Shodan.", status: "mitigated", action: "logged" },
  { id: "EVT-7840", ts: "11:18 AM", asset: "Supabase — Dzong", category: "API abuse", severity: "medium", ip: "47.91.183.22", country: "China", details: "Anon key hit RLS policy 412 times in 60s targeting `bookings` table. Auto rate-limited.", status: "mitigated", action: "rate-limited" },
  { id: "EVT-7839", ts: "10:54 AM", asset: "Islaura Resort", category: "Path traversal", severity: "medium", ip: "103.224.182.252", country: "India", details: "Crafted GET to /../../etc/passwd · blocked at Vercel edge.", status: "mitigated", action: "blocked" },
  { id: "EVT-7838", ts: "10:42 AM", asset: "Anthropic API", category: "Rate limit", severity: "low", ip: "Internal", country: "—", details: "Burst from automation hit tier-1 RPM limit · auto-backoff kicked in.", status: "resolved", action: "rate-limited" },
  { id: "EVT-7837", ts: "09:36 AM", asset: "Islaura Hotel", category: "Failed login", severity: "info", ip: "112.198.78.102", country: "Philippines", details: "Demo login attempts with `admin/admin` — placeholder auth not enabled.", status: "resolved", action: "logged" },
  { id: "EVT-7836", ts: "09:14 AM", asset: "GitHub Org", category: "Geo anomaly", severity: "high", ip: "62.102.148.69", country: "Sweden", details: "SSH key auth attempt from new country (Sweden) — blocked by 2FA requirement.", status: "investigating", action: "challenged" },
  { id: "EVT-7835", ts: "08:48 AM", asset: "n8n Instance", category: "DDoS", severity: "high", ip: "Multiple (412 IPs)", country: "Various", details: "L7 flood targeting /webhook endpoint · 4,200 req/min · mitigated by Cloudflare WAF.", status: "mitigated", action: "blocked" },
  { id: "EVT-7834", ts: "08:12 AM", asset: "PayMongo (test)", category: "CSP violation", severity: "low", ip: "—", country: "—", details: "Third-party widget script blocked by strict CSP · likely benign analytics.", status: "open", action: "blocked" },
  { id: "EVT-7833", ts: "07:24 AM", asset: "Dzong Cafe & Grill", category: "SQL injection", severity: "medium", ip: "194.61.55.99", country: "Romania", details: "Classic `OR 1=1` probe via ?search= param · all queries are typed, blocked.", status: "mitigated", action: "blocked" },
];

export const vulnerabilities: VulnerabilityReport[] = [
  { id: "VUL-014", asset: "All Next.js apps", cve: "CVE-2023-44270", title: "PostCSS bundled in Next.js — XSS via CSS stringifier (not exploitable in our build pipeline)", severity: "low", detectedAt: "2026-05-19", status: "accepted-risk" },
  { id: "VUL-013", asset: "n8n Instance", title: "n8n version 1.42 → upstream patch available (1.48)", severity: "medium", detectedAt: "2026-05-22", status: "in-progress" },
  { id: "VUL-012", asset: "Hostinger VPS", title: "Ubuntu 22.04 kernel update recommended (CVE-2026-1031)", severity: "medium", detectedAt: "2026-05-21", status: "open" },
  { id: "VUL-011", asset: "All API endpoints", title: "Add response signature verification for inbound webhooks", severity: "medium", detectedAt: "2026-05-18", status: "in-progress" },
  { id: "VUL-010", asset: "Supabase — Dzong", title: "RLS policy on `audit_logs` table needs explicit DENY for anon role", severity: "low", detectedAt: "2026-05-17", status: "patched" },
];

export const githubRepos: GithubRepoState[] = [
  { name: "dzong-cafe-grill-dashboard", url: "https://github.com/rustysumalinog-dot/dzong-cafe-grill-dashboard", visibility: "public", stars: 3, forks: 1, watchers: 2, newForks24h: 1, lastPush: "2026-05-19", pulse: "watch", suspiciousForks: ["bot-account-x42"] },
  { name: "islaura-hotel-dashboard", url: "https://github.com/rustysumalinog-dot/islaura-hotel-dashboard", visibility: "public", stars: 2, forks: 0, watchers: 1, newForks24h: 0, lastPush: "2026-05-19", pulse: "healthy", suspiciousForks: [] },
  { name: "islaura-resort-dashboard", url: "https://github.com/rustysumalinog-dot/islaura-resort-dashboard", visibility: "public", stars: 1, forks: 0, watchers: 1, newForks24h: 0, lastPush: "2026-05-25", pulse: "healthy", suspiciousForks: [] },
  { name: "nexus-sentinel-dashboard", url: "https://github.com/rustysumalinog-dot/nexus-sentinel-dashboard", visibility: "public", stars: 0, forks: 0, watchers: 1, newForks24h: 0, lastPush: "live", pulse: "healthy", suspiciousForks: [] },
  { name: "project-nexus-handbook", url: "https://github.com/rustysumalinog-dot/project-nexus-handbook", visibility: "private", stars: 0, forks: 0, watchers: 1, newForks24h: 0, lastPush: "2026-05-19", pulse: "healthy", suspiciousForks: [] },
];

export const brandMentions: BrandMention[] = [
  { id: "MEN-038", source: "TLD scan", title: "Suspicious domain registration: rustysumalinog.com (vs your .dev)", url: "https://rustysumalinog.com", matchedTerm: "rustysumalinog", sentiment: "impersonation", detectedAt: "11:24 AM", status: "investigating", similarityScore: 98 },
  { id: "MEN-037", source: "GitHub", title: "Fork pushed verbatim to bot-account-x42/dzong-cafe-grill-dashboard (no attribution)", url: "https://github.com/bot-account-x42/dzong-cafe-grill-dashboard", matchedTerm: "dzong-cafe-grill-dashboard", sentiment: "impersonation", detectedAt: "10:48 AM", status: "new", similarityScore: 100 },
  { id: "MEN-036", source: "Google", title: "Mention in 'Top 10 PH Freelance Devs to Watch in 2026' blog post", url: "https://example-blog.ph/top-ph-devs", matchedTerm: "Rusty Sumalinog", sentiment: "positive", detectedAt: "09:32 AM", status: "resolved", similarityScore: 100 },
  { id: "MEN-035", source: "Wayback", title: "Cached version of dzong.vercel.app archived by Internet Archive", url: "https://web.archive.org/web/2026/dzong.vercel.app", matchedTerm: "dzong.vercel.app", sentiment: "neutral", detectedAt: "Yesterday", status: "false-positive", similarityScore: 100 },
  { id: "MEN-034", source: "Twitter", title: "@filipinodev shared dzong.vercel.app as 'beautiful demo from PH'", url: "https://twitter.com/filipinodev/status/example", matchedTerm: "dzong.vercel.app", sentiment: "positive", detectedAt: "Yesterday", status: "resolved", similarityScore: 100 },
  { id: "MEN-033", source: "Reddit", title: "r/webdev thread referencing Islaura dashboard architecture", url: "https://reddit.com/r/webdev/comments/example", matchedTerm: "Islaura", sentiment: "neutral", detectedAt: "2026-05-23", status: "resolved", similarityScore: 90 },
  { id: "MEN-032", source: "GitHub", title: "Code search hit: copy-pasted KpiCard.tsx in another user's repo (with attribution)", url: "https://github.com/other-dev/some-project", matchedTerm: "KpiCard.tsx fingerprint", sentiment: "neutral", detectedAt: "2026-05-22", status: "resolved", similarityScore: 84 },
  { id: "MEN-031", source: "TLD scan", title: "dzong-restaurant.com registered (different industry, low concern)", url: "https://dzong-restaurant.com", matchedTerm: "dzong", sentiment: "neutral", detectedAt: "2026-05-21", status: "false-positive", similarityScore: 62 },
];

export const apiUsage: ApiUsage[] = [
  { provider: "Anthropic Claude", callsToday: 4248, costToday: 84.20, costMonth: 1842.50, budgetUsedPct: 36, rateLimitUsedPct: 42, status: "operational" },
  { provider: "OpenAI (fallback)", callsToday: 642, costToday: 12.80, costMonth: 284.40, budgetUsedPct: 18, rateLimitUsedPct: 12, status: "degraded", lastError: "504 Gateway Timeout (3 retries, 11:42 AM)" },
  { provider: "Supabase", callsToday: 2842, costToday: 0, costMonth: 25.00, budgetUsedPct: 8, rateLimitUsedPct: 14, status: "operational" },
  { provider: "GoHighLevel", callsToday: 412, costToday: 0, costMonth: 97.00, budgetUsedPct: 0, rateLimitUsedPct: 22, status: "operational" },
  { provider: "PayMongo (test)", callsToday: 24, costToday: 0, costMonth: 0, budgetUsedPct: 0, rateLimitUsedPct: 2, status: "operational" },
  { provider: "Semaphore SMS", callsToday: 86, costToday: 43.00, costMonth: 942.00, budgetUsedPct: 47, rateLimitUsedPct: 8, status: "operational" },
];

export const notificationSummary = {
  criticalEvents: threats.filter((t) => t.severity === "critical").length,
  openInvestigations: threats.filter((t) => t.status === "investigating" || t.status === "open").length,
  impersonations: brandMentions.filter((m) => m.sentiment === "impersonation" && m.status !== "resolved" && m.status !== "false-positive").length,
  vulnerabilitiesOpen: vulnerabilities.filter((v) => v.status === "open" || v.status === "in-progress").length,
  suspiciousForks: githubRepos.reduce((s, r) => s + r.suspiciousForks.length, 0),
  apiDegradations: apiUsage.filter((a) => a.status !== "operational").length,
};
