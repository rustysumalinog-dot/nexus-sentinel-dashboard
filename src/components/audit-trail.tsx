"use client";

import { auditTrail } from "@/lib/mock-data";
import { ScrollText, Bot, UserCog } from "lucide-react";

export function AuditTrail() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <ScrollText size={18} className="text-sentinel-cyan" />
        <h2 className="font-semibold text-lg text-foreground">Audit trail</h2>
      </div>
      <p className="text-xs text-muted mb-4">Who-did-what · automated + manual actions</p>
      <ol className="relative border-l border-border ml-2 space-y-4">
        {auditTrail.map((entry, i) => {
          const isHuman = /Rusty|Architect/i.test(entry.actor);
          const Icon = isHuman ? UserCog : Bot;
          return (
            <li key={i} className="ml-4">
              <span
                className="absolute -left-[7px] w-3 h-3 rounded-full bg-sentinel-cyan border-2 border-card"
                aria-hidden
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-muted tabular-nums">{entry.ts}</span>
                <span
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isHuman ? "rgba(6,182,212,0.12)" : "rgba(148,163,184,0.12)",
                  }}
                >
                  <Icon size={10} className={isHuman ? "text-sentinel-cyan" : "text-muted"} />
                  <span className={isHuman ? "text-sentinel-cyan" : "text-muted"}>{entry.actor}</span>
                </span>
              </div>
              <div className="text-sm text-foreground mt-1 leading-snug">{entry.action}</div>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted font-mono text-center">
        Immutable log · retained 90 days · exportable for compliance
      </div>
    </div>
  );
}
