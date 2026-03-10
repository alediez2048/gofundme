import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <Header />
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-8" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
