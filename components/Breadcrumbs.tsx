import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-supporting">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-neutral-disabled" aria-hidden>
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="rounded-sm transition-colors duration-hrt ease-hrt hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-heading" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
