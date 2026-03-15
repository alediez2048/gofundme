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
        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setTab("traces")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "traces"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            AI Traces
          </button>
          <button
            type="button"
            onClick={() => setTab("schema")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === "schema"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Schema / JSON-LD
          </button>
        </div>

        {tab === "traces" && <AITracesPanel />}
        {tab === "schema" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">JSON-LD Schema Viewer</h2>
              <p className="mt-1 text-sm text-stone-600">
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
