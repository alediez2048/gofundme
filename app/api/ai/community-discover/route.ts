/**
 * FR-022: API route for Community Discovery Assistant.
 * POST /api/ai/community-discover
 * Body: { query: string, fundraisers: Fundraiser[] }
 */

import { NextResponse } from "next/server";
import type { Fundraiser } from "@/lib/data";
import { discoverFundraisers } from "@/lib/ai/community-discovery";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, fundraisers } = body as {
      query: string;
      fundraisers: Fundraiser[];
    };

    if (!query?.trim()) {
      return NextResponse.json({ ranked: [], isAiGenerated: false });
    }

    const result = await discoverFundraisers(query.trim(), fundraisers ?? []);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
