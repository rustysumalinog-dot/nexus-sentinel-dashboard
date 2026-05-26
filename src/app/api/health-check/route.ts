import { NextResponse } from "next/server";

export const revalidate = 60;

const TARGETS = [
  { id: "AST-001", name: "Dzong Cafe & Grill", url: "https://dzong.vercel.app" },
  { id: "AST-002", name: "Islaura Hotel — Siargao", url: "https://islaura.vercel.app" },
  { id: "AST-003", name: "Islaura Resort — El Nido", url: "https://islaura-resort.vercel.app" },
];

interface HealthResult {
  id: string;
  name: string;
  url: string;
  status: "operational" | "degraded" | "outage";
  httpStatus: number | null;
  responseMs: number | null;
  checkedAt: string;
  error?: string;
}

async function ping(target: { id: string; name: string; url: string }): Promise<HealthResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(target.url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
      redirect: "follow",
    });
    clearTimeout(timeoutId);
    const elapsed = Date.now() - started;
    const ok = res.status >= 200 && res.status < 400;
    return {
      id: target.id,
      name: target.name,
      url: target.url,
      status: ok ? (elapsed > 2000 ? "degraded" : "operational") : "degraded",
      httpStatus: res.status,
      responseMs: elapsed,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      id: target.id,
      name: target.name,
      url: target.url,
      status: "outage",
      httpStatus: null,
      responseMs: Date.now() - started,
      checkedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}

export async function GET() {
  const results = await Promise.all(TARGETS.map(ping));
  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    results,
  });
}
