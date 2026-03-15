"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { getStore } from "@/lib/store";
import type { AITrace } from "@/lib/ai/trace";

type StatusFilter = "all" | "success" | "fallback" | "error";
type FeatureFilter = "all" | string;

function statusColor(status: AITrace["status"]): string {
  switch (status) {
    case "success":
      return "bg-emerald-100 text-emerald-800";
    case "fallback":
      return "bg-amber-100 text-amber-800";
    case "error":
      return "bg-red-100 text-red-800";
  }
}

function TraceCard({ trace }: { trace: AITrace }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(trace.status)}`}
          >
            {trace.status}
          </span>
          <span className="text-sm font-medium text-heading truncate">
            {trace.feature}
          </span>
          <span className="text-xs text-secondary shrink-0">
            {trace.metrics.latencyMs}ms
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0 ml-2">
          {new Date(trace.timestamp).toLocaleTimeString()}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3 text-sm">
          {/* Input */}
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Input</p>
            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs text-heading max-h-32 overflow-auto">
              {trace.input.prompt}
            </pre>
          </div>

          {/* Tool calls */}
          {trace.output.toolCalls && trace.output.toolCalls.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Tool Calls ({trace.output.toolCalls.length})
              </p>
              <ul className="mt-1 space-y-1">
                {trace.output.toolCalls.map((tc, i) => (
                  <li key={i} className="rounded bg-blue-50 p-2 text-xs">
                    <span className="font-medium text-blue-800">{tc.name}</span>
                    <pre className="mt-1 whitespace-pre-wrap text-blue-700 max-h-20 overflow-auto">
                      {JSON.stringify(tc.input, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Output */}
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Output</p>
            <pre className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs text-heading max-h-32 overflow-auto">
              {trace.output.text}
            </pre>
          </div>

          {/* Metrics */}
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Metrics</p>
            <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-secondary">Latency</dt>
                <dd className="font-medium text-heading">{trace.metrics.latencyMs}ms</dd>
              </div>
              <div>
                <dt className="text-secondary">Input tokens</dt>
                <dd className="font-medium text-heading">{trace.metrics.inputTokens}</dd>
              </div>
              <div>
                <dt className="text-secondary">Output tokens</dt>
                <dd className="font-medium text-heading">{trace.metrics.outputTokens}</dd>
              </div>
              <div>
                <dt className="text-secondary">Total tokens</dt>
                <dd className="font-medium text-heading">{trace.metrics.totalTokens}</dd>
              </div>
            </dl>
          </div>

          {/* Fallback reason */}
          {trace.fallbackReason && (
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Fallback Reason
              </p>
              <p className="mt-1 text-xs text-amber-700">{trace.fallbackReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AITracesPanel() {
  const clientTraces = useFundRightStore((s) => s.traces);
  const [serverTraces, setServerTraces] = useState<AITrace[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [featureFilter, setFeatureFilter] = useState<FeatureFilter>("all");

  // Fetch server-side traces on mount
  const fetchServerTraces = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/traces");
      if (res.ok) {
        const data = await res.json();
        setServerTraces(data.traces ?? []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchServerTraces();
  }, [fetchServerTraces]);

  // Merge client + server traces, deduplicate by ID
  const traces = useMemo(() => {
    const seen = new Set<string>();
    const merged: AITrace[] = [];
    for (const t of [...clientTraces, ...serverTraces]) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        merged.push(t);
      }
    }
    return merged;
  }, [clientTraces, serverTraces]);

  const features = useMemo(() => {
    const set = new Set(traces.map((t) => t.feature));
    return Array.from(set).sort();
  }, [traces]);

  const filtered = useMemo(() => {
    let list = [...traces].reverse(); // most recent first
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (featureFilter !== "all") {
      list = list.filter((t) => t.feature === featureFilter);
    }
    return list;
  }, [traces, statusFilter, featureFilter]);

  // Summary stats
  const stats = useMemo(() => {
    if (traces.length === 0) return null;
    const avgLatency = Math.round(
      traces.reduce((s, t) => s + t.metrics.latencyMs, 0) / traces.length
    );
    const totalTokens = traces.reduce((s, t) => s + t.metrics.totalTokens, 0);
    const fallbackCount = traces.filter((t) => t.status === "fallback").length;
    const fallbackRate = Math.round((fallbackCount / traces.length) * 100);
    return { total: traces.length, avgLatency, totalTokens, fallbackRate };
  }, [traces]);

  const handleClear = async () => {
    getStore().getState().clearTraces();
    setServerTraces([]);
    try {
      await fetch("/api/ai/traces", { method: "DELETE" });
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-heading">AI Traces</h2>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-heading hover:bg-gray-50"
        >
          Clear traces
        </button>
      </div>

      {/* Summary stats */}
      {stats && (
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center rounded-lg bg-gray-50 p-4">
          <div>
            <dt className="text-xs text-secondary">Total traces</dt>
            <dd className="text-lg font-semibold text-heading">{stats.total}</dd>
          </div>
          <div>
            <dt className="text-xs text-secondary">Avg latency</dt>
            <dd className="text-lg font-semibold text-heading">{stats.avgLatency}ms</dd>
          </div>
          <div>
            <dt className="text-xs text-secondary">Total tokens</dt>
            <dd className="text-lg font-semibold text-heading">
              {stats.totalTokens.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-secondary">Fallback rate</dt>
            <dd className="text-lg font-semibold text-heading">{stats.fallbackRate}%</dd>
          </div>
        </dl>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-heading"
        >
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="fallback">Fallback</option>
          <option value="error">Error</option>
        </select>
        <select
          value={featureFilter}
          onChange={(e) => setFeatureFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-heading"
        >
          <option value="all">All features</option>
          {features.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Trace list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
          <p className="text-secondary">No AI traces yet.</p>
          <p className="mt-1 text-sm text-secondary">
            Use AI features (create with AI Assist, Smart Search, etc.) to see traces here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((trace) => (
            <TraceCard key={trace.id} trace={trace} />
          ))}
        </div>
      )}
    </div>
  );
}
