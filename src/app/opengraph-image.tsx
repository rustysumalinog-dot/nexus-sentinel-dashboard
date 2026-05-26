import { ImageResponse } from "next/og";

export const alt =
  "Project Nexus Sentinel — Personal Security Operations Console. Monitors uptime, visitors, threats, code theft, and brand impersonation across Rusty's infrastructure.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #020617 0%, #0c1936 50%, #0e7490 100%)",
          padding: "72px",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "18px",
              background: "rgba(6, 182, 212, 0.15)",
              border: "2px solid #06b6d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06b6d4",
              fontSize: "44px",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            NS
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#06b6d4",
                textTransform: "uppercase",
                letterSpacing: "4px",
              }}
            >
              Security Operations · v0.1.0
            </div>
            <div style={{ fontSize: "44px", fontWeight: 800, marginTop: "4px" }}>
              Project Nexus Sentinel
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "56px",
            display: "flex",
            flexDirection: "column",
            fontSize: "52px",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          <div style={{ display: "flex" }}>Personal SOC for Rusty&apos;s</div>
          <div style={{ display: "flex", color: "#06b6d4" }}>
            dashboards · n8n · APIs · GitHub
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: "16px",
            alignItems: "stretch",
          }}
        >
          {[
            { label: "Posture", value: "87/100", accent: "#10b981" },
            { label: "Visitors", value: "1.8K", accent: "#06b6d4" },
            { label: "Blocked", value: "412", accent: "#ef4444" },
            { label: "Assets", value: "11/12", accent: "#f59e0b" },
          ].map((tile) => (
            <div
              key={tile.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px",
                background: "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${tile.accent}`,
                borderRadius: "14px",
              }}
            >
              <div style={{ fontSize: "14px", color: tile.accent, textTransform: "uppercase", letterSpacing: "3px", fontWeight: 700 }}>
                {tile.label}
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, marginTop: "6px", color: "#fff" }}>
                {tile.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex" }}>Next.js 16</div>
            <div style={{ display: "flex" }}>·</div>
            <div style={{ display: "flex" }}>Tailwind v4</div>
            <div style={{ display: "flex" }}>·</div>
            <div style={{ display: "flex" }}>Live monitoring</div>
            <div style={{ display: "flex" }}>·</div>
            <div style={{ display: "flex" }}>WAF + RLS</div>
          </div>
          <div style={{ fontWeight: 600, color: "#06b6d4" }}>nexus-sentinel.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
