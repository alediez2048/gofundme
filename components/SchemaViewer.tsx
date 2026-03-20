"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface SchemaEntry {
  type: string;
  id?: string;
  raw: Record<string, unknown>;
}

function parseSchemas(): SchemaEntry[] {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const entries: SchemaEntry[] = [];
  scripts.forEach((el) => {
    try {
      const data = JSON.parse(el.textContent ?? "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        entries.push({
          type: String(item["@type"] ?? "Unknown"),
          id: item["@id"] ? String(item["@id"]) : undefined,
          raw: item,
        });
      }
    } catch {
      // skip invalid JSON
    }
  });
  return entries;
}

function typeColor(type: string): string {
  switch (type) {
    case "DonateAction":
      return "bg-brand-subtle text-brand-strong";
    case "Organization":
      return "bg-[#E1F6F6] text-[#1C456B]";
    case "FAQPage":
      return "bg-[#ECCFF6] text-[#642878]";
    case "ProfilePage":
      return "bg-surface-warm text-warning";
    case "Person":
      return "bg-[#F7CDDB] text-[#7E1946]";
    case "WebSite":
      return "bg-[#E1F6F6] text-informative";
    case "BreadcrumbList":
      return "bg-surface-medium text-heading";
    case "ItemList":
      return "bg-[#D4EDDA] text-[#155724]";
    default:
      return "bg-surface-extra text-heading";
  }
}

function highlightKey(key: string): string {
  const aeoKeys = ["@id", "@type", "sameAs", "dateModified", "nonprofitStatus"];
  if (aeoKeys.includes(key)) return "text-brand font-bold";
  if (key.startsWith("@")) return "text-informative font-medium";
  return "text-supporting";
}

function JsonRenderer({ data, depth = 0 }: { data: unknown; depth?: number }) {
  if (data === null || data === undefined) return <span className="text-neutral-disabled">null</span>;
  if (typeof data === "string") return <span className="text-positive">&quot;{data}&quot;</span>;
  if (typeof data === "number" || typeof data === "boolean")
    return <span className="text-warning">{String(data)}</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-neutral-disabled">[]</span>;
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-neutral-disabled">[</span>
        {data.map((item, i) => (
          <div key={i} style={{ marginLeft: 16 }}>
            <JsonRenderer data={item} depth={depth + 1} />
            {i < data.length - 1 && <span className="text-neutral-disabled">,</span>}
          </div>
        ))}
        <span className="text-neutral-disabled">]</span>
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-neutral-disabled">{"{"}</span>
        {entries.map(([key, value], i) => (
          <div key={key} style={{ marginLeft: 16 }}>
            <span className={highlightKey(key)}>&quot;{key}&quot;</span>
            <span className="text-neutral-disabled">: </span>
            <JsonRenderer data={value} depth={depth + 1} />
            {i < entries.length - 1 && <span className="text-neutral-disabled">,</span>}
          </div>
        ))}
        <span className="text-neutral-disabled">{"}"}</span>
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

export default function SchemaViewer() {
  const pathname = usePathname();
  const [schemas, setSchemas] = useState<SchemaEntry[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => setSchemas(parseSchemas()), 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (schemas.length === 0) {
    return (
      <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-8 text-center">
        <p className="text-supporting">No JSON-LD schemas found on this page.</p>
        <p className="mt-1 text-body-sm text-supporting">Navigate to a fundraiser, community, or profile page.</p>
      </div>
    );
  }

  const aeoFeatures = schemas.flatMap((s) => {
    const features: string[] = [];
    if (s.raw["@id"]) features.push("@id cross-reference");
    if (s.raw["sameAs"]) features.push("sameAs entity linking");
    if (s.raw["dateModified"]) features.push("dateModified freshness");
    if (s.raw["nonprofitStatus"]) features.push("nonprofitStatus");
    const checkNested = (obj: Record<string, unknown>) => {
      if (obj["@id"]) features.push(`nested @id: ${String(obj["@type"] ?? "entity")}`);
      if (obj["sameAs"]) features.push(`nested sameAs: ${String(obj["@type"] ?? "entity")}`);
    };
    if (typeof s.raw["agent"] === "object" && s.raw["agent"]) checkNested(s.raw["agent"] as Record<string, unknown>);
    if (typeof s.raw["recipient"] === "object" && s.raw["recipient"]) checkNested(s.raw["recipient"] as Record<string, unknown>);
    if (typeof s.raw["mainEntity"] === "object" && s.raw["mainEntity"] && !Array.isArray(s.raw["mainEntity"]))
      checkNested(s.raw["mainEntity"] as Record<string, unknown>);
    return features;
  });

  const uniqueAeo = Array.from(new Set(aeoFeatures));

  return (
    <div className="space-y-4">
      {/* AEO summary */}
      <div className="rounded-xl bg-brand-mint border border-brand-subtle p-4">
        <h3 className="text-body-sm font-bold text-brand-strong mb-2">
          AEO/GEO Features on This Page
        </h3>
        <p className="text-body-xs text-supporting mb-2">
          {schemas.length} schema{schemas.length !== 1 ? "s" : ""} detected &middot; {pathname}
        </p>
        {uniqueAeo.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {uniqueAeo.map((f) => (
              <span
                key={f}
                className="hrt-tag-brand text-body-xs"
              >
                {f}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-body-xs text-supporting">Base schema only (no advanced AEO features on this page type).</p>
        )}
      </div>

      {/* Schema cards */}
      {schemas.map((schema, i) => (
        <div key={i} className="rounded-xl border border-neutral-border bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}
            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-hrt ease-hrt hover:bg-surface-subtle"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded px-2.5 py-0.5 text-body-xs font-bold ${typeColor(schema.type)}`}>
                {schema.type}
              </span>
              {schema.id && (
                <span className="text-body-xs text-supporting truncate max-w-[300px]">
                  {schema.id}
                </span>
              )}
            </div>
            <span className="text-body-xs text-neutral-disabled">{expanded[i] ? "Collapse" : "Expand"}</span>
          </button>
          {expanded[i] && (
            <div className="border-t border-surface-medium px-4 py-3 overflow-x-auto">
              <pre className="text-body-xs font-mono leading-relaxed">
                <JsonRenderer data={schema.raw} />
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
