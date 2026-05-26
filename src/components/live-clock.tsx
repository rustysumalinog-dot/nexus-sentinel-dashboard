"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted">
        <Clock size={13} />
        <span className="font-mono">--:-- PHT</span>
      </div>
    );
  }

  const time = now.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  });

  return (
    <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted" title="Live timestamp">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <Clock size={13} />
      <span className="font-mono">{time} PHT</span>
    </div>
  );
}
