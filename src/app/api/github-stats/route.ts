import { NextResponse } from "next/server";

// Cache for 10 minutes — unauthenticated GitHub API allows 60 req/hr/IP.
export const revalidate = 600;

const GH_USER = "rustysumalinog-dot";

interface GhRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  pushed_at: string;
  private: boolean;
  fork: boolean;
}

interface RepoStat {
  name: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  pushedAt: string;
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "nexus-sentinel-dashboard",
        },
        next: { revalidate: 600 },
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API ${res.status}`, repos: [] },
        { status: 200 }
      );
    }

    const data = (await res.json()) as GhRepo[];
    const repos: RepoStat[] = data
      .filter((r) => !r.private)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        pushedAt: r.pushed_at,
      }));

    return NextResponse.json({
      ok: true,
      fetchedAt: new Date().toISOString(),
      totalRepos: repos.length,
      totalStars: repos.reduce((s, r) => s + r.stars, 0),
      totalForks: repos.reduce((s, r) => s + r.forks, 0),
      repos,
    });
  } catch (err) {
    clearTimeout(timeout);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "fetch failed", repos: [] },
      { status: 200 }
    );
  }
}
