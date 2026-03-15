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
const SYSTEM_PROMPT = `You are writing a short "About This Cause" section for a fundraising community page. Use only the provided context (community description, fundraiser stories, donor messages, and organizer quotes).

FORMAT REQUIREMENTS (AEO-optimized for AI citation extraction):
1. Lead with an answer-first block (40–60 words) that directly answers "What does this community do and why does it matter?" — this block should stand alone as a complete answer.
2. Follow with 1–2 short paragraphs covering what this community has accomplished and what's still needed.
3. Include inline source citations when referencing specific numbers or facts (e.g., "according to campaign organizer Janahan Selvakumaran" or "as reported in the Real-Time Alerts campaign").
4. Include at least one named organizer quote from the provided context, attributed with the person's name and role.
5. Use clear, empathetic language. Do not invent facts; ground every claim in the context.
6. Output only the summary text, no headings or labels.`;

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
