import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { AppProvider } from "@/lib/app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexus-sentinel.vercel.app"),
  title: {
    default: "Project Nexus Sentinel — Personal SOC",
    template: "%s · Nexus Sentinel",
  },
  description:
    "Personal security operations console for Rusty Sumalinog's infrastructure: dashboards, n8n VPS, API integrations, GitHub repos, and brand monitoring. Tracks uptime, visitors, threats, code theft, and impersonation attempts.",
  applicationName: "Project Nexus Sentinel",
  authors: [{ name: "Rusty Sumalinog", url: "https://github.com/rustysumalinog-dot" }],
  keywords: [
    "security dashboard",
    "SOC",
    "security operations center",
    "uptime monitoring",
    "threat detection",
    "brand protection",
    "Next.js",
    "Tailwind",
  ],
  openGraph: {
    type: "website",
    title: "Project Nexus Sentinel — Personal SOC",
    description:
      "Real-time security operations console — uptime, visitors, threats, code & brand protection. Built with Next.js 16, Tailwind v4, Recharts.",
    url: "https://nexus-sentinel.vercel.app",
    siteName: "Project Nexus Sentinel",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Nexus Sentinel — Personal SOC",
    description: "Real-time SOC console. Uptime · Visitors · Threats · Brand protection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('sentinel:theme');
    // Sentinel defaults to dark (SOC aesthetic)
    var theme = stored || 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`.trim();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
