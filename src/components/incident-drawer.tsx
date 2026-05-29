"use client";

import { useEffect } from "react";
import { X, Shield, MapPin, Server, Clock, Hash, Activity, FileText } from "lucide-react";
import type { ThreatEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-300 dark:border-red-900/60",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300 dark:border-orange-900/60",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-900/60",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300 dark:border-sky-900/60",
  info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700",
};

// Suggested remediation per category (demo intelligence).
const playbook: Record<string, string[]> = {
  "Credential stuffing": [
    "Confirm account lockout triggered and no successful auth occurred",
    "Rotate any credentials that may have been exposed",
    "Add geo-IP block for the offending ASN / Tor exit ranges",
    "Enable MFA enforcement if not already mandatory",
  ],
  "Bot scan": [
    "Verify probed paths return 404 (no sensitive endpoints exposed)",
    "Confirm /.env and admin routes are not reachable",
    "Optionally add the scanner ASN to a watchlist",
  ],
  "SQL injection": [
    "Confirm all queries use parameterized / typed statements",
    "Review WAF rule that caught the probe",
    "Check application logs for any anomalous query patterns",
  ],
  "API abuse": [
    "Verify RLS policy denied the unauthorized access",
    "Confirm rate-limit threshold is appropriate",
    "Consider per-IP throttling at the edge",
  ],
  "Path traversal": [
    "Confirm edge blocked the traversal attempt",
    "Verify no file system access is exposed by the app",
  ],
  "DDoS": [
    "Confirm Cloudflare WAF absorbed the flood",
    "Review traffic baseline and adjust rate rules",
    "Enable 'Under Attack' mode if sustained",
  ],
  "Geo anomaly": [
    "Confirm 2FA challenge blocked the attempt",
    "Notify the account owner if unexpected",
    "Review recent successful logins from new regions",
  ],
  "Rate limit": [
    "Confirm auto-backoff resolved the burst",
    "Review whether internal automation needs higher tier",
  ],
  "CSP violation": [
    "Identify the blocked script source",
    "Whitelist if legitimate, otherwise leave blocked",
  ],
  "Failed login": [
    "Confirm these are demo / placeholder attempts",
    "No action needed if auth is not yet enabled",
  ],
  "Credential stuffing ": [],
};

export function IncidentDrawer({ event, onClose }: { event: ThreatEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [event, onClose]);

  if (!event) return null;

  const steps = playbook[event.category] ?? ["Review event details", "Confirm automated action held", "Document and close if no impact"];

  return (
    <>
      <div onClick={onClose} aria-hidden className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <aside
        role="dialog"
        aria-label={`Incident ${event.id}`}
        className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-card border-l border-border flex flex-col shadow-2xl"
      >
        <header className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold font-mono border", severityStyles[event.severity])}>
                {event.severity}
              </span>
              <span className="font-mono text-xs text-muted">{event.id}</span>
            </div>
            <h2 className="font-bold text-foreground text-lg leading-tight">{event.category}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close incident"
            className="p-1.5 rounded-lg hover:bg-background text-muted shrink-0"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Meta icon={Server} label="Target asset" value={event.asset} />
            <Meta icon={Clock} label="Detected" value={event.ts} mono />
            <Meta icon={Hash} label="Source IP" value={event.ip} mono />
            <Meta icon={MapPin} label="Origin" value={event.country} />
            <Meta icon={Activity} label="Action taken" value={event.action} />
            <Meta icon={Shield} label="Status" value={event.status} />
          </div>

          {/* Description */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-muted mb-2 flex items-center gap-1.5">
              <FileText size={12} /> Forensic summary
            </div>
            <p className="text-sm text-foreground leading-relaxed bg-background border border-border rounded-lg p-4">
              {event.details}
            </p>
          </div>

          {/* Raw signature (decorative) */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-muted mb-2">Captured signature</div>
            <pre className="text-[11px] font-mono text-sentinel-cyan bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto">
{`{
  "event_id": "${event.id}",
  "category": "${event.category}",
  "severity": "${event.severity}",
  "src_ip": "${event.ip}",
  "geo": "${event.country}",
  "asset": "${event.asset}",
  "action": "${event.action}",
  "detected_at": "${event.ts}",
  "auto_mitigated": ${event.action !== "logged"}
}`}
            </pre>
          </div>

          {/* Playbook */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-muted mb-2">Recommended playbook</div>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-sentinel-cyan/15 text-sentinel-cyan text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-border flex gap-3">
          <button className="flex-1 py-2 rounded-lg bg-sentinel-cyan text-white text-sm font-semibold hover:bg-sentinel-cyan-dark transition-colors">
            Mark resolved
          </button>
          <button className="flex-1 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-semibold hover:bg-background transition-colors">
            Block source IP
          </button>
        </footer>
      </aside>
    </>
  );
}

function Meta({ icon: Icon, label, value, mono }: { icon: typeof Server; label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
        <Icon size={11} /> {label}
      </div>
      <div className={cn("text-foreground font-medium capitalize", mono && "font-mono text-xs normal-case")}>{value}</div>
    </div>
  );
}
