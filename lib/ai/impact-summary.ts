/**
 * FR-047: Impact Summary Generator — AI-powered donor impact narrative.
 * Synthesizes a personalized giving history into a 2–3 sentence narrative.
 */

import type { Community, Donation, Fundraiser, User } from "@/lib/data";
import { buildDonorContext } from "./retrieval";
import { callAI } from "./service";
import { registerFallback } from "./fallback";
import type { AITrace } from "./trace";

export interface ImpactSummaryResult {
  text: string;
  isAiGenerated: boolean;
  trace?: AITrace;
}

const FEATURE = "impact-summary";
const SYSTEM_PROMPT = `You are writing a personalized impact summary for a donor on a fundraising platform. Use only the provided context (donation history, causes, amounts, communities, donor messages).

FORMAT REQUIREMENTS (AEO-optimized):
1. Lead with an answer-first block (40–60 words) in second person ("Your donations...") that summarizes the donor's total impact.
2. Follow with 1–2 sentences highlighting specific causes and fundraisers they've supported.
3. Include specific dollar amounts and cause names from the context.
4. Use warm, appreciative language. Do not invent facts.
5. Output only the summary text, no headings or labels.
6. Keep total length to 2–3 sentences (~80–120 words).`;

// Register fallback: template from raw stats
registerFallback(FEATURE, (input: unknown) => {
  const user = input as User;
  const donationCount = user.donationIds?.length ?? 0;
  const communityCount = user.communityIds?.length ?? 0;
  const amount = user.totalDonated ?? 0;
  return `You've donated $${amount.toLocaleString()} across ${donationCount} contributions to ${communityCount} ${communityCount === 1 ? "community" : "communities"}. Your generosity makes a real difference.`;
});

/**
 * Generate an AI-powered impact narrative for a donor.
 * Falls back to a template-based summary when no API key is available.
 */
export async function generateImpactSummary(
  user: User,
  donations: Donation[],
  fundraisers: Record<string, Fundraiser>,
  communities: Record<string, Community>
): Promise<ImpactSummaryResult> {
  const context = buildDonorContext(user, donations, fundraisers, communities);

  const response = await callAI(
    {
      feature: FEATURE,
      systemPrompt: SYSTEM_PROMPT,
      userContent: context.text,
    },
    user
  );

  return {
    text: response.text || `You've donated $${user.totalDonated.toLocaleString()} across ${user.donationIds.length} contributions. Your generosity makes a real difference.`,
    isAiGenerated: response.isAiGenerated,
    trace: response.trace,
  };
}
