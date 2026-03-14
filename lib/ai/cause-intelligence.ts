/**
 * FR-023: Cause Intelligence — RAG-style cause summary for community pages.
 * Retrieves fundraiser stories and donation messages for a community, then
 * synthesizes a 2–3 paragraph "About This Cause" summary.
 *
 * Refactored (FR-020) to use the unified AI service with tracing and fallback.
 */

import type { Community, Donation, Fundraiser } from "@/lib/data";
import { buildCommunityContext } from "./retrieval";
import { callAI } from "./service";
import { registerFallback } from "./fallback";
import type { AITrace } from "./trace";

export interface CauseSummaryResult {
  text: string;
  isAiGenerated: boolean;
  trace?: AITrace;
}

const FEATURE = "cause-intelligence";
const SYSTEM_PROMPT = `You are writing a short "About This Cause" section for a fundraising community page. Use only the provided context (community description, fundraiser stories, and donor messages). Write 2–3 short paragraphs that cover: what the cause is, why it matters now, what this community has accomplished, and what's still needed. Use clear, empathetic language. Do not invent facts; ground every claim in the context. Output only the summary text, no headings or labels.`;

// Register fallback: return the static community description
registerFallback(FEATURE, (input: unknown) => {
  const community = input as Community;
  return community.description;
});

/**
 * Returns a cause summary for the community: either AI-generated from
 * fundraiser stories and donation messages (via the unified AI service),
 * or the static community description as fallback.
 */
export async function getCauseSummary(
  community: Community,
  fundraisers: Fundraiser[],
  donations: Donation[]
): Promise<CauseSummaryResult> {
  const context = buildCommunityContext(community, fundraisers, donations);

  const response = await callAI(
    {
      feature: FEATURE,
      systemPrompt: SYSTEM_PROMPT,
      userContent: context.text,
    },
    community
  );

  return {
    text: response.text || community.description,
    isAiGenerated: response.isAiGenerated,
    trace: response.trace,
  };
}
