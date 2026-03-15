"use client";

import Link from "next/link";
import { useFundRightStore } from "@/lib/store";

export default function AITracesBadge() {
  const traceCount = useFundRightStore((s) => s.traces.length);

  return (
    <Link
      href="/ai-traces"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-lg hover:bg-gray-800 transition-colors"
      title="View AI Traces"
    >
      <span aria-hidden="true">&#x2728;</span>
      AI
      {traceCount > 0 && (
        <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none">
          {traceCount}
        </span>
      )}
    </Link>
  );
}
