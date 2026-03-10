import Link from "next/link";

/**
 * TODO: Replace About / How It Works with real routes or homepage sections when
 * FR-008+ adds dedicated content. For now these link to homepage anchors (no
 * section IDs yet) — intentional placeholder to avoid dead /browse-style 404s.
 */
const QUICK_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/browse", label: "Browse" },
  { href: "/communities", label: "Communities" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-8" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm text-stone-600 max-w-xl">
          FundRight is a fundraising platform where donors discover causes, support campaigns,
          and see impact. Organizers build trust through profiles and communities.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {QUICK_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-stone-700 hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-stone-500">
          © {year} FundRight. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
