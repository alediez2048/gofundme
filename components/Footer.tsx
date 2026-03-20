import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Donate",
    links: [
      { href: "/browse", label: "Browse fundraisers" },
      { href: "/communities", label: "Communities" },
    ],
  },
  {
    heading: "Fundraise",
    links: [
      { href: "/create", label: "Start a fundraiser" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/#about", label: "About FundRight" },
      { href: "/#how-it-works", label: "How it works" },
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
    <footer className="bg-surface-dark py-12 sm:py-16" role="contentinfo">
      <div className="mx-auto max-w-content px-4">
        {/* Logo */}
        <Link href="/" className="text-heading-lg text-brand-lime tracking-tight">
          fund<span className="font-bold">right</span>
        </Link>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-body-sm font-bold text-white">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-body-sm text-gray-400 transition-colors duration-hrt ease-hrt hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-xs text-gray-500">
            &copy; 2026 FundRight. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-body-xs text-gray-500">Terms</span>
            <span className="text-body-xs text-gray-500">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
