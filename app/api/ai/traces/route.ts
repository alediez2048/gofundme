/**
 * FR-025: API route for AI trace retrieval.
 * GET /api/ai/traces — returns all server-side traces
 * DELETE /api/ai/traces — clears server-side traces
 */

import { NextResponse } from "next/server";
import { getServerTraces, clearServerTraces } from "@/lib/ai/trace";

export async function GET() {
  return NextResponse.json({ traces: getServerTraces() });
}

export async function DELETE() {
  clearServerTraces();
  return NextResponse.json({ cleared: true });
}
