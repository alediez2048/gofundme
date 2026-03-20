"use client";

import { useState } from "react";
import AITracesPanel from "@/components/AITracesPanel";
import SchemaViewer from "@/components/SchemaViewer";
import PageTransition from "@/components/PageTransition";

type Tab = "traces" | "schema";

export default function AITracesPage() {
  const [tab, setTab] = useState<Tab>("traces");

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex gap-1 rounded-xl bg-surface-extra p-1">
          <button
            type="button"
            onClick={() => setTab("traces")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-body-sm font-bold transition-all duration-hrt ease-hrt ${
              tab === "traces"
                ? "bg-white text-heading shadow-soft"
                : "text-supporting hover:text-heading"
            }`}
          >
            AI Traces
          </button>
          <button
            type="button"
            onClick={() => setTab("schema")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-body-sm font-bold transition-all duration-hrt ease-hrt ${
              tab === "schema"
                ? "bg-white text-heading shadow-soft"
                : "text-supporting hover:text-heading"
            }`}
          >
            Schema / JSON-LD
          </button>
        </div>

        {tab === "traces" && <AITracesPanel />}
        {tab === "schema" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-heading-lg text-heading">JSON-LD Schema Viewer</h2>
              <p className="mt-1 text-body-sm text-supporting">
                Navigate to any page, then come back here to inspect its structured data. AEO-specific fields are highlighted in green.
              </p>
            </div>
            <SchemaViewer />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
