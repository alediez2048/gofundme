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
      return "bg-brand-subtle text-brand-strong";
    case "fallback":
      return "bg-surface-warm text-warning";
    case "error":
      return "bg-[#FEF0EA] text-negative";
  }
}

function TraceCard({ trace }: { trace: AITrace }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-hrt ease-hrt hover:bg-surface-subtle"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-body-xs font-bold ${statusColor(trace.status)}`}
          >
            {trace.status}
          </span>
          <span className="text-body-sm font-bold text-heading truncate">
            {trace.feature}
          </span>
          <span className="text-body-xs text-supporting shrink-0">
            {trace.metrics.latencyMs}ms
          </span>
        </div>
        <span className="text-body-xs text-neutral-disabled shrink-0 ml-2">
          {new Date(trace.timestamp).toLocaleTimeString()}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-surface-medium px-4 py-3 space-y-3 text-body-sm">
          <div>
            <p className="text-body-xs font-bold text-supporting uppercase tracking-wide">Input</p>
            <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-subtle p-2 text-body-xs text-heading max-h-32 overflow-auto">
              {trace.input.prompt}
            </pre>
          </div>

          {trace.output.toolCalls && trace.output.toolCalls.length > 0 && (
            <div>
              <p className="text-body-xs font-bold text-supporting uppercase tracking-wide">
                Tool Calls ({trace.output.toolCalls.length})
              </p>
              <ul className="mt-1 space-y-1">
                {trace.output.toolCalls.map((tc, i) => (
                  <li key={i} className="rounded-lg bg-[#E1F6F6] p-2 text-body-xs">
                    <span className="font-bold text-informative">{tc.name}</span>
                    <pre className="mt-1 whitespace-pre-wrap text-informative max-h-20 overflow-auto">
                      {JSON.stringify(tc.input, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-body-xs font-bold text-supporting uppercase tracking-wide">Output</p>
            <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-subtle p-2 text-body-xs text-heading max-h-32 overflow-auto">
              {trace.output.text}
            </pre>
          </div>

          <div>
            <p className="text-body-xs font-bold text-supporting uppercase tracking-wide">Metrics</p>
            <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-body-xs sm:grid-cols-4">
              <div>
                <dt className="text-supporting">Latency</dt>
                <dd className="font-bold text-heading">{trace.metrics.latencyMs}ms</dd>
              </div>
              <div>
                <dt className="text-supporting">Input tokens</dt>
                <dd className="font-bold text-heading">{trace.metrics.inputTokens}</dd>
              </div>
              <div>
                <dt className="text-supporting">Output tokens</dt>
                <dd className="font-bold text-heading">{trace.metrics.outputTokens}</dd>
              </div>
              <div>
                <dt className="text-supporting">Total tokens</dt>
                <dd className="font-bold text-heading">{trace.metrics.totalTokens}</dd>
              </div>
            </dl>
          </div>

          {trace.fallbackReason && (
            <div>
              <p className="text-body-xs font-bold text-supporting uppercase tracking-wide">
                Fallback Reason
              </p>
              <p className="mt-1 text-body-xs text-warning">{trace.fallbackReason}</p>
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
    let list = [...traces].reverse();
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (featureFilter !== "all") {
      list = list.filter((t) => t.feature === featureFilter);
    }
    return list;
  }, [traces, statusFilter, featureFilter]);

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
        <h2 className="text-heading-lg text-heading">AI Traces</h2>
        <button
          type="button"
          onClick={handleClear}
          className="hrt-btn-secondary px-3 py-1.5 text-body-xs"
        >
          Clear traces
        </button>
      </div>

      {stats && (
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center rounded-xl bg-surface-subtle p-4">
          <div>
            <dt className="text-body-xs text-supporting">Total traces</dt>
            <dd className="text-heading-md text-heading">{stats.total}</dd>
          </div>
          <div>
            <dt className="text-body-xs text-supporting">Avg latency</dt>
            <dd className="text-heading-md text-heading">{stats.avgLatency}ms</dd>
          </div>
          <div>
            <dt className="text-body-xs text-supporting">Total tokens</dt>
            <dd className="text-heading-md text-heading">
              {stats.totalTokens.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-body-xs text-supporting">Fallback rate</dt>
            <dd className="text-heading-md text-heading">{stats.fallbackRate}%</dd>
          </div>
        </dl>
      )}

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-pill border border-neutral-border px-4 py-2 text-body-sm text-heading focus:border-heading focus:ring-1 focus:ring-heading"
        >
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="fallback">Fallback</option>
          <option value="error">Error</option>
        </select>
        <select
          value={featureFilter}
          onChange={(e) => setFeatureFilter(e.target.value)}
          className="rounded-pill border border-neutral-border px-4 py-2 text-body-sm text-heading focus:border-heading focus:ring-1 focus:ring-heading"
        >
          <option value="all">All features</option>
          {features.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xxl border border-dashed border-neutral-border bg-surface-subtle py-12 text-center">
          <p className="text-supporting">No AI traces yet.</p>
          <p className="mt-1 text-body-sm text-supporting">
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
