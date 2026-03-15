import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Donate",
    links: [
      { href: "/browse", label: "Browse Fundraisers" },
      { href: "/communities", label: "Communities" },
    ],
  },
  {
    heading: "Fundraise",
    links: [
      { href: "/create", label: "Start a Fundraiser" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/#about", label: "About FundRight" },
      { href: "/#how-it-works", label: "How It Works" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/ai-traces", label: "AI Traces" },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-10 sm:py-14" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-sm font-semibold text-white">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-500">
            &copy; 2026 FundRight
          </p>
        </div>
      </div>
    </footer>
  );
}
