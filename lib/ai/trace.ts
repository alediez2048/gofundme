/**
 * FR-020: AI trace logging — records every AI interaction for observability.
 */

export interface AITrace {
  id: string;
  timestamp: string;
  feature: string;
  input: { prompt: string; context?: Record<string, unknown> };
  output: { text: string; toolCalls?: ToolCallRecord[] };
  metrics: {
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    toolCallCount: number;
  };
  status: "success" | "fallback" | "error";
  fallbackReason?: string;
}

export interface ToolCallRecord {
  name: string;
  input: unknown;
  output: unknown;
}

export interface TraceBuilder {
  succeed(
    output: string,
    metrics?: Partial<AITrace["metrics"]>
  ): AITrace;
  fail(error: string, fallbackOutput: string): AITrace;
}

function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Start recording a trace. Call `.succeed()` or `.fail()` on the returned
 * builder to finalize and get the AITrace object.
 */
export function startTrace(feature: string, prompt: string): TraceBuilder {
  const id = generateTraceId();
  const timestamp = new Date().toISOString();
  const startMs = Date.now();

  return {
    succeed(output, metrics = {}) {
      const latencyMs = Date.now() - startMs;
      const trace: AITrace = {
        id,
        timestamp,
        feature,
        input: { prompt: prompt.slice(0, 500) },
        output: { text: output.slice(0, 500) },
        metrics: {
          latencyMs,
          inputTokens: metrics.inputTokens ?? 0,
          outputTokens: metrics.outputTokens ?? 0,
          totalTokens: metrics.totalTokens ?? 0,
          toolCallCount: metrics.toolCallCount ?? 0,
        },
        status: "success",
      };
      logTrace(trace);
      return trace;
    },

    fail(error, fallbackOutput) {
      const latencyMs = Date.now() - startMs;
      const trace: AITrace = {
        id,
        timestamp,
        feature,
        input: { prompt: prompt.slice(0, 500) },
        output: { text: fallbackOutput.slice(0, 500) },
        metrics: {
          latencyMs,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          toolCallCount: 0,
        },
        status: error === "no-api-key" ? "fallback" : "error",
        fallbackReason: error,
      };
      logTrace(trace);
      return trace;
    },
  };
}

/** Structured log for Vercel / server-side observability. */
function logTrace(trace: AITrace): void {
  console.log(
    JSON.stringify({
      type: "ai_trace",
      ...trace,
    })
  );
}
