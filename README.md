# Project Nexus Sentinel — Personal SOC Console

Personal Security Operations Center for **Rusty Sumalinog's infrastructure** — built as a hybrid demo + real-monitoring console.

> Fourth dashboard in the Project Nexus family. Demonstrates how the same multi-module architecture can pivot from *operational* (Dzong, Islaura) to *security* (Sentinel) with palette + content swap.

## Live Demo

🌐 **https://nexus-sentinel.vercel.app** *(once deployed)*

## What it monitors

| Asset class | Examples |
|---|---|
| **Live websites** | Dzong Cafe & Grill, Islaura Hotel, Islaura Resort (3 dashboards — real-time pinged) |
| **VPS** | n8n instance on Hostinger |
| **API integrations** | Anthropic, OpenAI, Supabase, GoHighLevel, PayMongo, Semaphore |
| **Source control** | GitHub org `rustysumalinog-dot` (5 public + 1 private repos) |
| **Domains** | rustysumalinog.dev + future portfolio |

## 5 Modules

| Module | What's inside |
|---|---|
| **Overview** | Posture score · Visitors today · Active alerts · Attacks blocked · **Live ping cards for 3 Vercel sites** · Weekly traffic chart · High-severity event feed · Asset summary |
| **Asset Health** | All 12 monitored assets with sortable table · live HTTP HEAD status for Vercel sites · API usage + cost + rate-limit per provider · Open vulnerabilities |
| **Visitor Analytics** | Per-site visitor metrics · Top countries (with flags) · Top referrers · Device split · Privacy posture note |
| **Threats & Incidents** | Critical-incident banner · Top attack categories · Origin countries · Searchable event log with severity, action, status |
| **Code & Brand Protection** | Impersonation alert banner · GitHub repo pulse (stars/forks/suspicious forks) · Brand mention queue with sentiment + similarity score |

## Real integrations (this build)

✅ **`/api/health-check`** — Server route that performs real HTTP HEAD requests against the 3 live Vercel sites every 60 seconds. Results show as live status indicators on the Overview and Asset Health pages.

## Mock-data integrations (ready to wire later)

- Cloudflare (WAF blocked attacks, geo)
- Plausible / Umami / PostHog (visitor analytics)
- Sentry (errors, performance)
- BetterStack / UptimeRobot (uptime monitoring)
- GitHub API (real fork/star counts, suspicious-account heuristics)
- Brand monitoring services (Mention.com, Brand24)
- TLD scanners (typosquat detection)

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** with custom theme variant
- **Recharts** for charts
- **lucide-react** for icons
- **Vercel** edge runtime for ping API

## Visual differentiation

| Sister project | Vibe | Palette |
|---|---|---|
| Dzong Cafe & Grill | Multi-branch QSR ops | Terracotta + Amber |
| Islaura Hotel | Boutique hotel | Teal + Gold |
| Islaura Resort | Luxury island resort | Indigo + Champagne |
| **Nexus Sentinel** | **SOC command center** | **Cyan + Red on Slate-950** |

Sentinel is **dark-first** with a subtle grid background — explicitly different from the operational dashboards because its job is different.

## Key Features (inherited from family architecture)

- 🌑 Dark mode (default for Sentinel) with localStorage persistence
- 📱 Mobile-responsive sidebar drawer + horizontal-scroll tables
- 🔍 Working search filtering current-page data
- 📊 Sortable column headers across all tables
- 🛎️ SOC alerts drawer with severity-aware bell badge
- 🕐 Live Asia/Manila clock
- ✨ Loading skeletons for route transitions
- 🛡️ Security headers (HSTS, CSP, X-Frame, Permissions-Policy) — see [SECURITY.md](./SECURITY.md)
- 🎨 Custom favicon (sentinel diamond) + dynamic 1200×630 OG image

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Production build

```bash
npm run build
```

## Sister projects (Project Nexus family)

- [Dzong Cafe & Grill](https://github.com/rustysumalinog-dot/dzong-cafe-grill-dashboard) — Multi-branch QSR
- [Islaura Hotel Siargao](https://github.com/rustysumalinog-dot/islaura-hotel-dashboard) — Boutique hotel
- [Islaura Resort El Nido](https://github.com/rustysumalinog-dot/islaura-resort-dashboard) — Luxury resort

## License

MIT — fork freely. The Sentinel pattern is specifically designed to be adapted for personal/agency SOC use; just replace mock data and wire real services.
