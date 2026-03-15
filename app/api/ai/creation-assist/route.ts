/**
 * FR-021: API route for Creation Assistant tool calls.
 * POST /api/ai/creation-assist
 * Body: { tool: string, params: object }
 */

import { NextResponse } from "next/server";
import {
  suggestGoalAmount,
  enhanceStory,
  assignCategory,
  searchSimilarFundraisers,
} from "@/lib/ai/creation-assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, params } = body as { tool: string; params: Record<string, string> };

    switch (tool) {
      case "suggestGoalAmount": {
        const result = await suggestGoalAmount(
          params.category ?? "",
          params.communityId
        );
        return NextResponse.json(result);
      }

      case "enhanceStory": {
        const result = await enhanceStory(params.story ?? "");
        return NextResponse.json(result);
      }

      case "assignCategory": {
        const result = await assignCategory(
          params.title ?? "",
          params.story ?? ""
        );
        return NextResponse.json(result);
      }

      case "searchSimilarFundraisers": {
        const result = await searchSimilarFundraisers(
          params.title ?? "",
          params.story ?? ""
        );
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown tool: ${tool}` },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
