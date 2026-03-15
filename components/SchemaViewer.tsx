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
      return "bg-emerald-100 text-emerald-800";
    case "Organization":
      return "bg-blue-100 text-blue-800";
    case "FAQPage":
      return "bg-purple-100 text-purple-800";
    case "ProfilePage":
      return "bg-amber-100 text-amber-800";
    case "Person":
      return "bg-pink-100 text-pink-800";
    case "WebSite":
      return "bg-indigo-100 text-indigo-800";
    case "BreadcrumbList":
      return "bg-stone-200 text-stone-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function highlightKey(key: string): string {
  const aeoKeys = ["@id", "@type", "sameAs", "dateModified", "nonprofitStatus"];
  if (aeoKeys.includes(key)) return "text-primary font-bold";
  if (key.startsWith("@")) return "text-blue-600 font-medium";
  return "text-stone-500";
}

function JsonRenderer({ data, depth = 0 }: { data: unknown; depth?: number }) {
  if (data === null || data === undefined) return <span className="text-stone-400">null</span>;
  if (typeof data === "string") return <span className="text-emerald-700">&quot;{data}&quot;</span>;
  if (typeof data === "number" || typeof data === "boolean")
    return <span className="text-amber-700">{String(data)}</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-stone-400">[]</span>;
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-stone-400">[</span>
        {data.map((item, i) => (
          <div key={i} style={{ marginLeft: 16 }}>
            <JsonRenderer data={item} depth={depth + 1} />
            {i < data.length - 1 && <span className="text-stone-400">,</span>}
          </div>
        ))}
        <span className="text-stone-400">]</span>
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
        <span className="text-stone-400">{"{"}</span>
        {entries.map(([key, value], i) => (
          <div key={key} style={{ marginLeft: 16 }}>
            <span className={highlightKey(key)}>&quot;{key}&quot;</span>
            <span className="text-stone-400">: </span>
            <JsonRenderer data={value} depth={depth + 1} />
            {i < entries.length - 1 && <span className="text-stone-400">,</span>}
          </div>
        ))}
        <span className="text-stone-400">{"}"}</span>
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
    // Small delay to ensure page has rendered JSON-LD
    const timer = setTimeout(() => setSchemas(parseSchemas()), 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (schemas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 py-8 text-center">
        <p className="text-stone-600">No JSON-LD schemas found on this page.</p>
        <p className="mt-1 text-sm text-stone-500">Navigate to a fundraiser, community, or profile page.</p>
      </div>
    );
  }

  const aeoFeatures = schemas.flatMap((s) => {
    const features: string[] = [];
    if (s.raw["@id"]) features.push("@id cross-reference");
    if (s.raw["sameAs"]) features.push("sameAs entity linking");
    if (s.raw["dateModified"]) features.push("dateModified freshness");
    if (s.raw["nonprofitStatus"]) features.push("nonprofitStatus");
    // Check nested entities
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
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
        <h3 className="text-sm font-semibold text-primary mb-2">
          AEO/GEO Features on This Page
        </h3>
        <p className="text-xs text-stone-600 mb-2">
          {schemas.length} schema{schemas.length !== 1 ? "s" : ""} detected &middot; {pathname}
        </p>
        {uniqueAeo.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {uniqueAeo.map((f) => (
              <span
                key={f}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {f}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500">Base schema only (no advanced AEO features on this page type).</p>
        )}
      </div>

      {/* Schema cards */}
      {schemas.map((schema, i) => (
        <div key={i} className="rounded-lg border border-stone-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor(schema.type)}`}>
                {schema.type}
              </span>
              {schema.id && (
                <span className="text-xs text-stone-500 truncate max-w-[300px]">
                  {schema.id}
                </span>
              )}
            </div>
            <span className="text-xs text-stone-400">{expanded[i] ? "Collapse" : "Expand"}</span>
          </button>
          {expanded[i] && (
            <div className="border-t border-stone-100 px-4 py-3 overflow-x-auto">
              <pre className="text-xs font-mono leading-relaxed">
                <JsonRenderer data={schema.raw} />
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
