"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ServerCog,
  Users,
  ShieldAlert,
  Fingerprint,
  Menu,
  X,
} from "lucide-react";
import { projectMeta, operator } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/assets", label: "Asset Health", icon: ServerCog },
  { href: "/visitors", label: "Visitor Analytics", icon: Users },
  { href: "/threats", label: "Threats & Incidents", icon: ShieldAlert },
  { href: "/protection", label: "Code & Brand Protection", icon: Fingerprint },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-3.5 left-3 z-40 p-2 rounded-lg bg-slate-950 text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 bg-slate-950 text-white flex flex-col transition-transform duration-200 ease-out border-r border-slate-800",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-sentinel-cyan/40 pulse-ring" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-sentinel-cyan to-sentinel-cyan-dark flex items-center justify-center text-white font-black text-base shadow-lg shadow-cyan-500/30">
                ◆
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm leading-tight">{projectMeta.codename}</div>
              <div className="text-[10px] uppercase tracking-widest text-sentinel-cyan/80 font-mono">
                {projectMeta.version}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-1 -mr-1 text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sentinel-cyan/15 text-sentinel-cyan border border-sentinel-cyan/30"
                    : "text-white/75 hover:bg-white/5 hover:text-white border border-transparent"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold uppercase tracking-wide text-[10px]">
              Uplink active
            </span>
          </div>
          <div className="font-mono text-[10px] text-white/50 break-all">{projectMeta.uplink}</div>
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="text-white font-semibold">{operator.alias}</div>
            <div className="text-white/60 text-[10px]">{operator.role}</div>
            <div className="text-sentinel-cyan/80 text-[10px] mt-0.5">{operator.clearance}</div>
          </div>
          <div className="mt-3 opacity-50 text-[10px] leading-tight">
            Personal SOC · Not a real business product
          </div>
        </div>
      </aside>
    </>
  );
}
