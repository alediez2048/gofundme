/**
 * FR-022: Community Discovery Assistant — RAG-powered natural language
 * search within a community's fundraisers.
 */

import type { Fundraiser } from "@/lib/data";
import { callAI } from "./service";
import { registerFallback } from "./fallback";

const FEATURE = "community-discovery";

export interface RankedFundraiser {
  fundraiserId: string;
  explanation: string;
}

export interface DiscoveryResult {
  ranked: RankedFundraiser[];
  isAiGenerated: boolean;
}

registerFallback(FEATURE, () => JSON.stringify({ ranked: [] }));

/**
 * AI-powered: send query + fundraiser context to LLM, get ranked IDs with explanations.
 */
export async function discoverFundraisers(
  query: string,
  fundraisers: Fundraiser[]
): Promise<DiscoveryResult> {
  if (fundraisers.length === 0) {
    return { ranked: [], isAiGenerated: false };
  }

  const context = fundraisers
    .map((f) => {
      const pct = f.goalAmount > 0 ? Math.round((f.raisedAmount / f.goalAmount) * 100) : 0;
      return `[ID: ${f.id}] "${f.title}" — ${pct}% funded ($${f.raisedAmount.toLocaleString()} of $${f.goalAmount.toLocaleString()}), ${f.donationCount} donations. Story excerpt: ${f.story.slice(0, 200)}`;
    })
    .join("\n");

  const response = await callAI({
    feature: FEATURE,
    systemPrompt: `You are a fundraiser discovery assistant. Given a user query and a list of fundraisers, rank the most relevant ones.

Return JSON: {"ranked": [{"fundraiserId": "...", "explanation": "1 sentence, answer-first format"}]}

Rules:
- Only include fundraisers that match the query. If none match, return empty array.
- Each explanation should be a self-contained sentence starting with what matters most (answer-first AEO pattern).
- Example explanation: "This fundraiser is 87% funded and focuses on evacuation routes — closest match to your query."
- Return at most 5 results.`,
    userContent: `Query: "${query}"\n\nFundraisers:\n${context}`,
    maxTokens: 300,
    temperature: 0.3,
  });

  if (response.isAiGenerated) {
    try {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed.ranked)) {
        // Validate fundraiser IDs
        const validIds = new Set(fundraisers.map((f) => f.id));
        const ranked = parsed.ranked
          .filter((r: RankedFundraiser) => validIds.has(r.fundraiserId))
          .map((r: RankedFundraiser) => ({
            fundraiserId: r.fundraiserId,
            explanation: r.explanation ?? "",
          }));
        return { ranked, isAiGenerated: true };
      }
    } catch {
      // AI didn't return valid JSON, fall through
    }
  }

  return { ranked: [], isAiGenerated: false };
}

/**
 * Client-side keyword fallback: filters and sorts fundraisers by query match.
 */
export function keywordFilter(
  query: string,
  fundraisers: Fundraiser[]
): Fundraiser[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return fundraisers;

  return fundraisers
    .map((f) => {
      const text = `${f.title} ${f.story}`.toLowerCase();
      const score = words.filter((w) => text.includes(w)).length;
      return { f, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.f);
}
