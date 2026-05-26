"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props<K extends string> {
  field: K;
  active: K;
  dir: "asc" | "desc";
  onToggle: (field: K) => void;
  align?: "left" | "right";
  children: React.ReactNode;
}

export function SortableTH<K extends string>({
  field,
  active,
  dir,
  onToggle,
  align = "left",
  children,
}: Props<K>) {
  const isActive = active === field;
  const Icon = isActive ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th className={cn("px-6 py-3 font-semibold", align === "right" ? "text-right" : "text-left")}>
      <button
        type="button"
        onClick={() => onToggle(field)}
        className={cn(
          "inline-flex items-center gap-1.5 group hover:text-foreground transition-colors",
          align === "right" && "flex-row-reverse",
          isActive && "text-foreground"
        )}
      >
        {children}
        <Icon size={12} className={cn(isActive ? "opacity-100" : "opacity-30 group-hover:opacity-60")} />
      </button>
    </th>
  );
}
