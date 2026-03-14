/**
 * FR-011: Cause Intelligence — RAG-style cause summary for community pages.
 * Retrieves fundraiser stories and donation messages for a community, then
 * synthesizes a 2–3 paragraph "About This Cause" summary. Fallback: static
 * community.description when OPENAI_API_KEY is not set.
 */

import OpenAI from "openai";
import type { Community, Donation, Fundraiser } from "@/lib/data";

const MAX_STORY_CHARS = 800;

export interface CauseSummaryResult {
  text: string;
  isAiGenerated: boolean;
}

function buildRagContext(
  community: Community,
  fundraisers: Fundraiser[],
  donations: Donation[]
): string {
  const fundraiserIds = new Set(community.fundraiserIds ?? []);
  const donationsByFund = new Map<string, Donation[]>();
  for (const d of donations) {
    if (fundraiserIds.has(d.fundraiserId)) {
      const list = donationsByFund.get(d.fundraiserId) ?? [];
      list.push(d);
      donationsByFund.set(d.fundraiserId, list);
    }
  }

  const parts: string[] = [
    `Community: ${community.name}`,
    `Category: ${community.causeCategory}`,
    `Description: ${community.description}`,
    "",
    "--- Fundraiser stories and donor messages ---",
  ];

  for (const f of fundraisers) {
    const storyExcerpt =
      f.story.length > MAX_STORY_CHARS
        ? f.story.slice(0, MAX_STORY_CHARS) + "..."
        : f.story;
    parts.push(`[Fundraiser: ${f.title}]\n${storyExcerpt}`);
    const fundDonations = (donationsByFund.get(f.id) ?? [])
      .filter((d) => d.message)
      .slice(0, 10)
      .map((d) => d.message as string);
    if (fundDonations.length > 0) {
      parts.push("Donor messages: " + fundDonations.join(" | "));
    }
    parts.push("");
  }

  return parts.join("\n");
}

/**
 * Returns a cause summary for the community: either AI-generated from
 * fundraiser stories and donation messages (when OPENAI_API_KEY is set),
 * or the static community description.
 */
export async function getCauseSummary(
  community: Community,
  fundraisers: Fundraiser[],
  donations: Donation[]
): Promise<CauseSummaryResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { text: community.description, isAiGenerated: false };
  }

  const context = buildRagContext(community, fundraisers, donations);
  const openai = new OpenAI({ apiKey });

  const systemPrompt = `You are writing a short "About This Cause" section for a fundraising community page. Use only the provided context (community description, fundraiser stories, and donor messages). Write 2–3 short paragraphs that cover: what the cause is, why it matters now, what this community has accomplished, and what's still needed. Use clear, empathetic language. Do not invent facts; ground every claim in the context. Output only the summary text, no headings or labels.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: context },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    const text =
      completion.choices[0]?.message?.content?.trim() ?? community.description;
    return { text: text || community.description, isAiGenerated: true };
  } catch {
    return { text: community.description, isAiGenerated: false };
  }
}
