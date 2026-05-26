"use client";

import { Search, X } from "lucide-react";
import { useApp } from "@/lib/app-provider";

export function SearchInput() {
  const { search, setSearch } = useApp();

  return (
    <div className="relative hidden md:block">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search assets, IPs, threats, mentions..."
        aria-label="Search"
        className="pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted w-56 lg:w-72 focus:outline-none focus:ring-2 focus:ring-sentinel-cyan/40 font-mono"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted hover:text-foreground hover:bg-card"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
