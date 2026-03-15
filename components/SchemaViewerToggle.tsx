"use client";

import { useState } from "react";
import SchemaViewer from "./SchemaViewer";

export default function SchemaViewerToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button — positioned above the AI badge */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`fixed bottom-14 right-4 z-40 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium shadow-lg transition-colors ${
          open
            ? "bg-primary text-primary-foreground"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
        title="View JSON-LD Schema"
      >
        {"</>"}
        Schema
      </button>

      {/* Slide-up panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-30 max-h-[70vh] overflow-y-auto rounded-t-xl border-t border-gray-200 bg-white p-4 shadow-2xl sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-heading">JSON-LD Structured Data</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-heading hover:bg-gray-50"
            >
              Close
            </button>
          </div>
          <SchemaViewer />
        </div>
      )}
    </>
  );
}
