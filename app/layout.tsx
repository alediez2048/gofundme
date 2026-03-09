import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Skip to main content
        </a>
        <header className="border-b border-stone-200 bg-white" role="banner">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
            <a href="/" className="font-semibold text-primary">
              FundRight
            </a>
          </nav>
        </header>
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-8" role="main">
          {children}
        </main>
        <footer className="border-t border-stone-200 bg-stone-100 py-6" role="contentinfo">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-stone-600">
            FundRight — AI-Powered Fundraising Platform
          </div>
        </footer>
      </body>
    </html>
  );
}
