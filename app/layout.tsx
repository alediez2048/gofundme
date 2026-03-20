import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fundright-display",
});

export const metadata: Metadata = {
  title: "FundRight — AI-Powered Fundraising",
  description:
    "A reimagined fundraising experience. Profile, Fundraiser, and Community pages that work together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-white text-heading antialiased ${dmSans.className} ${dmSerifDisplay.variable}`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-brand-strong focus:px-4 focus:py-2 focus:text-brand-lime focus:outline-none"
        >
          Skip to main content
        </a>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
