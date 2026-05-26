# Security

## Posture

This is a static portfolio dashboard with **mock data only**. No authentication, no database, no user input, no server actions. The attack surface is therefore narrow — it's effectively a brochure site.

## Hardening applied

### HTTP response headers (see `next.config.ts`)

| Header | Purpose |
|---|---|
| `Strict-Transport-Security` | Force HTTPS for 2 years, include subdomains, preload-ready |
| `X-Content-Type-Options: nosniff` | Block MIME-type sniffing |
| `X-Frame-Options: DENY` | Block iframe embedding (clickjacking) |
| `Referrer-Policy: strict-origin-when-cross-origin` | Don't leak full URLs cross-origin |
| `Permissions-Policy` | Disable camera, mic, geolocation, payment, USB, sensors, FLoC |
| `Content-Security-Policy` | Restrict script/style/img/font/connect sources to `self` + minimal allowlist |

CSP includes `'unsafe-inline'` and `'unsafe-eval'` for scripts because Next.js' bootstrap and Recharts emit inline JS. No user-controlled data flows into scripts, so the residual XSS risk is theoretical.

`frame-ancestors 'none'` and `X-Frame-Options: DENY` together block iframing — defeats clickjacking even if a referring site tries to embed the dashboard.

`X-Powered-By` is disabled (`poweredByHeader: false`) so the response doesn't advertise the framework.

### Dependency audit

`npm audit` reports 2 moderate vulnerabilities — both transitive in Next.js's bundled PostCSS (CVE in `<style>` stringifier output, CVSS 6.1). **Not exploitable here**: our PostCSS pipeline only processes our own static CSS at build time. The advisory matters when applications process attacker-controlled CSS at runtime, which this app never does. The npm-suggested "fix" is to downgrade Next.js to 9.3.3, which is a major regression we are not taking. We track upstream and will update when Next.js bundles a patched PostCSS.

## Vercel platform protections

Provided by hosting, not configured in this repo:
- TLS 1.3 with auto-renewing certificates
- DDoS protection at the edge
- HTTP/2 + HTTP/3
- Static asset caching with immutable headers

## What is intentionally **not** hardened

- **No auth / no rate limiting** — this is a public portfolio demo. Any visitor can browse.
- **No CSRF tokens / no SameSite cookie config** — no cookies, no mutations.
- **No bot blocking** — recruiters often use HR tools that scrape pages; blocking them would defeat the purpose.

## Reporting

If you find a real issue (not a tool-flagged false positive), email <rustysumalinog@gmail.com>.
