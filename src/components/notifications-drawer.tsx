"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  X,
  AlertOctagon,
  ShieldAlert,
  Fingerprint,
  GitFork,
  ServerCrash,
  Globe,
} from "lucide-react";
import { notificationSummary } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  icon: typeof Bell;
  title: string;
  body: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

function buildNotifications(): NotificationItem[] {
  const items: NotificationItem[] = [];
  const { criticalEvents, openInvestigations, impersonations, vulnerabilitiesOpen, suspiciousForks, apiDegradations } = notificationSummary;

  if (criticalEvents > 0) {
    items.push({
      id: "critical-events",
      icon: AlertOctagon,
      title: `${criticalEvents} CRITICAL event${criticalEvents > 1 ? "s" : ""} active`,
      body: "Credential stuffing detected on n8n. WAF block engaged. Manual review required.",
      time: "Just now",
      severity: "critical",
    });
  }

  if (impersonations > 0) {
    items.push({
      id: "impersonations",
      icon: Globe,
      title: `${impersonations} brand impersonation${impersonations > 1 ? "s" : ""} flagged`,
      body: "Suspicious TLD registration + unauthorized fork. Review evidence and prepare DMCA / WHOIS abuse report.",
      time: "11:24 AM",
      severity: "critical",
    });
  }

  if (suspiciousForks > 0) {
    items.push({
      id: "suspicious-forks",
      icon: GitFork,
      title: `${suspiciousForks} suspicious GitHub fork${suspiciousForks > 1 ? "s" : ""}`,
      body: "Verbatim copy detected from a bot-style account. Consider GitHub abuse report.",
      time: "10:48 AM",
      severity: "warning",
    });
  }

  if (openInvestigations > 0) {
    items.push({
      id: "investigations",
      icon: ShieldAlert,
      title: `${openInvestigations} active investigation${openInvestigations > 1 ? "s" : ""}`,
      body: "Open + investigating events across n8n, Supabase, GitHub. SOC queue.",
      time: "Earlier today",
      severity: "warning",
    });
  }

  if (apiDegradations > 0) {
    items.push({
      id: "api-degraded",
      icon: ServerCrash,
      title: `${apiDegradations} API provider degraded`,
      body: "OpenAI API showing elevated latency. Auto-failover to Anthropic active.",
      time: "11:42 AM",
      severity: "warning",
    });
  }

  if (vulnerabilitiesOpen > 0) {
    items.push({
      id: "vulns",
      icon: Fingerprint,
      title: `${vulnerabilitiesOpen} open vulnerabilit${vulnerabilitiesOpen > 1 ? "ies" : "y"}`,
      body: "Pending: n8n upgrade, kernel CVE, webhook signature verification. Schedule patch window.",
      time: "Today",
      severity: "info",
    });
  }

  if (items.length === 0) {
    items.push({
      id: "all-clear",
      icon: Bell,
      title: "Walang alerts ngayon",
      body: "All systems nominal. Sentinel watch ongoing.",
      time: "—",
      severity: "info",
    });
  }

  return items;
}

const severityStyles: Record<NotificationItem["severity"], string> = {
  critical: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50",
  warning: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  info: "text-sentinel-cyan bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/50",
};

export function NotificationsDrawer() {
  const [open, setOpen] = useState(false);
  const notifications = buildNotifications();
  const unread = notifications.filter((n) => n.id !== "all-clear").length;
  const hasCritical = notifications.some((n) => n.severity === "critical");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Notifications (${unread})`}
        className={cn(
          "relative p-2 rounded-lg border text-foreground transition-colors",
          hasCritical
            ? "border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:hover:bg-red-950/60"
            : "border-border hover:bg-background"
        )}
      >
        <Bell size={18} className={hasCritical ? "text-red-600 dark:text-red-300" : ""} />
        {unread > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center",
            hasCritical ? "bg-red-600 animate-pulse" : "bg-sentinel-cyan"
          )}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-label="Notifications"
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-card border-l border-border flex flex-col shadow-2xl"
          >
            <header className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">SOC Alerts</h2>
                <p className="text-xs text-muted">{unread} active · sorted by severity</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1.5 rounded-lg hover:bg-background text-muted"
              >
                <X size={18} />
              </button>
            </header>
            <ul className="flex-1 overflow-y-auto divide-y divide-border">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.id} className="px-6 py-4 hover:bg-background/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border", severityStyles[n.severity])}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="font-semibold text-sm text-foreground">{n.title}</div>
                          <div className="text-xs text-muted shrink-0 font-mono">{n.time}</div>
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{n.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="px-6 py-3 border-t border-border text-center">
              <span className="text-xs text-muted">Live monitoring · auto-refresh 60s</span>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}
