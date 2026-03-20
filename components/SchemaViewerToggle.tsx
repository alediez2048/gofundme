"use client";

import { useState } from "react";
import SchemaViewer from "./SchemaViewer";

export default function SchemaViewerToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`fixed bottom-14 right-4 z-40 flex items-center gap-1.5 rounded-pill px-3 py-2 text-body-xs font-bold shadow-strong transition-all duration-hrt ease-hrt ${
          open
            ? "bg-brand-strong text-brand-lime"
            : "bg-surface-dark text-white hover:bg-brand-darkest"
        }`}
        title="View JSON-LD Schema"
      >
        {"</>"}
        Schema
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-30 max-h-[70vh] overflow-y-auto rounded-t-xxl border-t border-neutral-border bg-white p-4 shadow-strong sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-md text-heading">JSON-LD Structured Data</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="hrt-btn-secondary px-3 py-1 text-body-xs"
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
