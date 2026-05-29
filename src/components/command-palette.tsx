"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ServerCog,
  Users,
  ShieldAlert,
  Fingerprint,
  Moon,
  Sun,
  RefreshCw,
  Sparkles,
  Search,
  CornerDownLeft,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/app-provider";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  group: "Navigate" | "Actions" | "External";
  run: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, toggleTheme, replayBoot } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const commands: Command[] = useMemo(() => {
    const go = (href: string) => () => { router.push(href); close(); };
    const ext = (url: string) => () => { window.open(url, "_blank", "noopener,noreferrer"); close(); };
    return [
      { id: "nav-overview", label: "Overview", hint: "Security operations home", icon: LayoutDashboard, group: "Navigate", run: go("/"), keywords: "dashboard home soc" },
      { id: "nav-assets", label: "Asset Health", hint: "Uptime, APIs, vulnerabilities", icon: ServerCog, group: "Navigate", run: go("/assets"), keywords: "uptime vps api ssl" },
      { id: "nav-visitors", label: "Visitor Analytics", hint: "Traffic, geo, referrers", icon: Users, group: "Navigate", run: go("/visitors"), keywords: "traffic visitors geo" },
      { id: "nav-threats", label: "Threats & Incidents", hint: "Event log, attacks", icon: ShieldAlert, group: "Navigate", run: go("/threats"), keywords: "attacks events incidents waf" },
      { id: "nav-protection", label: "Code & Brand Protection", hint: "Forks, impersonation", icon: Fingerprint, group: "Navigate", run: go("/protection"), keywords: "github fork brand dmca impersonation" },
      { id: "act-theme", label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", hint: "Toggle theme", icon: theme === "dark" ? Sun : Moon, group: "Actions", run: () => { toggleTheme(); close(); }, keywords: "dark light theme" },
      { id: "act-boot", label: "Replay Boot Sequence", hint: "Run THE ENTITY intro", icon: Sparkles, group: "Actions", run: () => { replayBoot(); close(); }, keywords: "entity jarvis splash intro" },
      { id: "act-refresh", label: "Run Health Check", hint: "Re-ping all live sites", icon: RefreshCw, group: "Actions", run: () => { router.push("/assets"); router.refresh(); close(); }, keywords: "ping refresh uptime" },
      { id: "ext-dzong", label: "Open Dzong Cafe & Grill", hint: "dzong.vercel.app", icon: ExternalLink, group: "External", run: ext("https://dzong.vercel.app"), keywords: "dzong restaurant" },
      { id: "ext-hotel", label: "Open Islaura Hotel", hint: "islaura.vercel.app", icon: ExternalLink, group: "External", run: ext("https://islaura.vercel.app"), keywords: "islaura hotel siargao" },
      { id: "ext-resort", label: "Open Islaura Resort", hint: "islaura-resort.vercel.app", icon: ExternalLink, group: "External", run: ext("https://islaura-resort.vercel.app"), keywords: "islaura resort el nido" },
      { id: "ext-portfolio", label: "Open Portfolio", hint: "rustysumalinog.onrender.com", icon: ExternalLink, group: "External", run: ext("https://rustysumalinog.onrender.com"), keywords: "portfolio render" },
      { id: "ext-github", label: "Open GitHub Org", hint: "github.com/rustysumalinog-dot", icon: ExternalLink, group: "External", run: ext("https://github.com/rustysumalinog-dot"), keywords: "github repos code" },
    ];
  }, [router, theme, toggleTheme, replayBoot]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        (c.keywords?.includes(q) ?? false)
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  let runningIndex = -1;
  const groups: Command["group"][] = ["Navigate", "Actions", "External"];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onListKey}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-muted shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, pages, sites..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted focus:outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex text-[10px] font-mono text-muted border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">Walang command na tugma sa &ldquo;{query}&rdquo;.</div>
          ) : (
            groups.map((group) => {
              const groupItems = filtered.filter((c) => c.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="px-2 mb-1">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-widest font-mono text-muted">{group}</div>
                  {groupItems.map((c) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const Icon = c.icon;
                    const isActive = idx === active;
                    return (
                      <button
                        key={c.id}
                        onClick={c.run}
                        onMouseEnter={() => setActive(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          isActive ? "bg-sentinel-cyan/15 text-foreground" : "text-foreground/80 hover:bg-background"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", isActive ? "bg-sentinel-cyan/20 text-sentinel-cyan" : "bg-background text-muted")}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{c.label}</div>
                          <div className="text-xs text-muted truncate">{c.hint}</div>
                        </div>
                        {isActive && <CornerDownLeft size={14} className="text-sentinel-cyan shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted">
          <span className="flex items-center gap-2">
            <kbd className="border border-border rounded px-1">↑</kbd>
            <kbd className="border border-border rounded px-1">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border rounded px-1">↵</kbd>
            select
          </span>
          <span>Project Nexus Sentinel</span>
        </div>
      </div>
    </div>
  );
}
