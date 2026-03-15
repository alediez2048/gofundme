/**
 * FR-021: Creation Assistant — 4 AI tools for the /create form.
 * Tools: suggestGoalAmount, enhanceStory, assignCategory, searchSimilarFundraisers
 * Each tool can run with or without an API key (fallback mode).
 */

import type { CauseCategory, Fundraiser } from "@/lib/data";
import { seed } from "@/lib/data";
import { callAI } from "./service";
import { registerFallback } from "./fallback";

// ——— Types ———

export interface GoalSuggestion {
  suggestedGoal: number;
  reasoning: string;
  similarCount: number;
}

export interface StorySuggestion {
  clarityScore: number;
  missingElements: string[];
  suggestions: string[];
  aeoPrompts: string[];
}

export interface CategorySuggestion {
  category: CauseCategory;
  confidence: number;
  reasoning: string;
}

export interface SimilarFundraiser {
  title: string;
  slug: string;
  raisedAmount: number;
  goalAmount: number;
  differentiation: string;
}

export interface SimilarFundraisersResult {
  similar: SimilarFundraiser[];
}

// ——— Helpers ———

function getAllFundraisers(): Fundraiser[] {
  return seed.fundraisers;
}

function wordOverlap(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  let overlap = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) overlap++;
  });
  return overlap;
}

// ——— Tool: suggestGoalAmount ———

const GOAL_FEATURE = "creation-suggest-goal";

registerFallback(GOAL_FEATURE, () =>
  JSON.stringify({
    suggestedGoal: 0,
    reasoning: "Set an API key to get AI-powered goal suggestions based on similar campaigns.",
    similarCount: 0,
  })
);

export async function suggestGoalAmount(
  category: string,
  communityId?: string
): Promise<GoalSuggestion> {
  const all = getAllFundraisers();
  const similar = all.filter((f) => {
    if (communityId && f.communityId === communityId) return true;
    return f.causeCategory === category;
  });

  if (similar.length === 0) {
    return {
      suggestedGoal: 5000,
      reasoning: "No similar fundraisers found. $5,000 is a common starting goal.",
      similarCount: 0,
    };
  }

  const avgGoal = Math.round(similar.reduce((s, f) => s + f.goalAmount, 0) / similar.length);
  const avgRaised = Math.round(similar.reduce((s, f) => s + f.raisedAmount, 0) / similar.length);

  const context = similar
    .map((f) => `- ${f.title}: goal $${f.goalAmount.toLocaleString()}, raised $${f.raisedAmount.toLocaleString()}`)
    .join("\n");

  const response = await callAI({
    feature: GOAL_FEATURE,
    systemPrompt:
      "You suggest a fundraiser goal amount. Given similar fundraisers, suggest a realistic goal and explain why in 1-2 sentences. Return JSON: {suggestedGoal: number, reasoning: string}",
    userContent: `Category: ${category}\nSimilar fundraisers:\n${context}\nAverage goal: $${avgGoal.toLocaleString()}\nAverage raised: $${avgRaised.toLocaleString()}`,
    maxTokens: 150,
    temperature: 0.3,
  });

  if (response.isAiGenerated) {
    try {
      const parsed = JSON.parse(response.text);
      return {
        suggestedGoal: parsed.suggestedGoal ?? avgGoal,
        reasoning: parsed.reasoning ?? `Based on ${similar.length} similar campaigns.`,
        similarCount: similar.length,
      };
    } catch {
      // AI didn't return valid JSON, use computed values
    }
  }

  return {
    suggestedGoal: avgGoal,
    reasoning: `Similar fundraisers in ${category} average $${avgGoal.toLocaleString()} goals and raise $${avgRaised.toLocaleString()}.`,
    similarCount: similar.length,
  };
}

// ——— Tool: enhanceStory ———

const STORY_FEATURE = "creation-enhance-story";

registerFallback(STORY_FEATURE, () =>
  JSON.stringify({
    clarityScore: 0,
    missingElements: [],
    suggestions: [
      "Fundraisers with stories over 300 words raise 2x more.",
      "Include specific numbers — how many people will be helped?",
      "Add a personal quote from someone affected.",
    ],
    aeoPrompts: [
      "Add a specific number — how many families will be helped?",
      "Include a direct quote from someone affected.",
    ],
  })
);

export async function enhanceStory(story: string): Promise<StorySuggestion> {
  const wordCount = story.trim().split(/\s+/).filter(Boolean).length;

  const response = await callAI({
    feature: STORY_FEATURE,
    systemPrompt: `You analyze a fundraiser story and provide improvement suggestions. Return JSON:
{
  "clarityScore": 1-10,
  "missingElements": ["impact", "fund usage", "urgency", etc.],
  "suggestions": ["specific actionable suggestions"],
  "aeoPrompts": ["questions the organizer should answer in their story"]
}
Check for: concrete impact numbers, fund usage breakdown, urgency/timeliness, personal connection, call to action. Be specific and actionable.`,
    userContent: `Story (${wordCount} words):\n${story}`,
    maxTokens: 300,
    temperature: 0.4,
  });

  if (response.isAiGenerated) {
    try {
      const parsed = JSON.parse(response.text);
      return {
        clarityScore: parsed.clarityScore ?? 5,
        missingElements: parsed.missingElements ?? [],
        suggestions: parsed.suggestions ?? [],
        aeoPrompts: parsed.aeoPrompts ?? [
          "Add a specific number — how many families will be helped?",
          "Include a direct quote from someone affected.",
        ],
      };
    } catch {
      // AI didn't return valid JSON
    }
  }

  // Fallback: basic analysis
  const missingElements: string[] = [];
  const suggestions: string[] = [];

  if (wordCount < 300) {
    suggestions.push(`Your story is ${wordCount} words. Fundraisers with 300+ words raise 2x more.`);
  }
  if (!/\$\d|dollar|USD/i.test(story)) {
    missingElements.push("fund usage");
    suggestions.push("Explain how the funds will be used with specific amounts.");
  }
  if (!/\d+\s*(famil|people|person|child|student|patient)/i.test(story)) {
    missingElements.push("impact numbers");
    suggestions.push("Include specific numbers — how many people will benefit?");
  }
  if (!/"[^"]+"|'[^']+'/.test(story)) {
    missingElements.push("personal quotes");
  }

  return {
    clarityScore: Math.min(10, Math.max(1, Math.round(wordCount / 50))),
    missingElements,
    suggestions,
    aeoPrompts: [
      "Add a specific number — how many families will be helped?",
      "Include a direct quote from someone affected.",
    ],
  };
}

// ——— Tool: assignCategory ———

const CATEGORY_FEATURE = "creation-assign-category";

const CATEGORIES: CauseCategory[] = [
  "Disaster Relief & Wildfire Safety",
  "Medical & Healthcare",
];

registerFallback(CATEGORY_FEATURE, () =>
  JSON.stringify({
    category: "",
    confidence: 0,
    reasoning: "Select a category manually, or set an API key for AI-powered suggestions.",
  })
);

export async function assignCategory(
  title: string,
  story: string
): Promise<CategorySuggestion> {
  const response = await callAI({
    feature: CATEGORY_FEATURE,
    systemPrompt: `You categorize fundraisers. Available categories: ${CATEGORIES.join(", ")}.
Return JSON: {"category": "exact category name", "confidence": 0.0-1.0, "reasoning": "why"}`,
    userContent: `Title: ${title}\nStory excerpt: ${story.slice(0, 500)}`,
    maxTokens: 100,
    temperature: 0.2,
  });

  if (response.isAiGenerated) {
    try {
      const parsed = JSON.parse(response.text);
      const matchedCategory = CATEGORIES.find(
        (c) => c.toLowerCase() === String(parsed.category).toLowerCase()
      );
      if (matchedCategory) {
        return {
          category: matchedCategory,
          confidence: parsed.confidence ?? 0.8,
          reasoning: parsed.reasoning ?? "Based on title and story content.",
        };
      }
    } catch {
      // AI didn't return valid JSON
    }
  }

  // Fallback: keyword matching
  const text = `${title} ${story}`.toLowerCase();
  const disasterWords = ["wildfire", "fire", "disaster", "relief", "emergency", "evacuation", "alert"];
  const medicalWords = ["medical", "health", "hospital", "surgery", "treatment", "cancer", "therapy"];

  const disasterScore = disasterWords.filter((w) => text.includes(w)).length;
  const medicalScore = medicalWords.filter((w) => text.includes(w)).length;

  if (disasterScore > medicalScore && disasterScore > 0) {
    return {
      category: "Disaster Relief & Wildfire Safety",
      confidence: Math.min(0.9, disasterScore * 0.3),
      reasoning: `Found ${disasterScore} disaster-related keyword${disasterScore !== 1 ? "s" : ""} in your title and story.`,
    };
  }
  if (medicalScore > 0) {
    return {
      category: "Medical & Healthcare",
      confidence: Math.min(0.9, medicalScore * 0.3),
      reasoning: `Found ${medicalScore} medical keyword${medicalScore !== 1 ? "s" : ""} in your title and story.`,
    };
  }

  return {
    category: CATEGORIES[0],
    confidence: 0.2,
    reasoning: "Could not confidently determine a category. Please select one manually.",
  };
}

// ——— Tool: searchSimilarFundraisers ———

const SIMILAR_FEATURE = "creation-similar-search";

registerFallback(SIMILAR_FEATURE, () =>
  JSON.stringify({ similar: [] })
);

export async function searchSimilarFundraisers(
  title: string,
  story: string
): Promise<SimilarFundraisersResult> {
  const all = getAllFundraisers();
  const query = `${title} ${story}`;

  // Rank by keyword overlap
  const ranked = all
    .map((f) => ({
      fundraiser: f,
      score: wordOverlap(query, `${f.title} ${f.story}`),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (ranked.length === 0) {
    return { similar: [] };
  }

  const context = ranked
    .map((r) => `- "${r.fundraiser.title}" (${r.fundraiser.causeCategory}, $${r.fundraiser.raisedAmount.toLocaleString()} raised of $${r.fundraiser.goalAmount.toLocaleString()})`)
    .join("\n");

  const response = await callAI({
    feature: SIMILAR_FEATURE,
    systemPrompt: `Given a new fundraiser and similar existing ones, suggest how to differentiate.
Return JSON: {"similar": [{"title": "...", "slug": "...", "differentiation": "1-sentence advice"}]}`,
    userContent: `New fundraiser: "${title}"\nExisting similar:\n${context}`,
    maxTokens: 200,
    temperature: 0.4,
  });

  if (response.isAiGenerated) {
    try {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed.similar)) {
        return {
          similar: parsed.similar.map((s: Record<string, string>, i: number) => ({
            title: s.title ?? ranked[i]?.fundraiser.title ?? "",
            slug: ranked[i]?.fundraiser.slug ?? "",
            raisedAmount: ranked[i]?.fundraiser.raisedAmount ?? 0,
            goalAmount: ranked[i]?.fundraiser.goalAmount ?? 0,
            differentiation: s.differentiation ?? "Focus on what makes your campaign unique.",
          })),
        };
      }
    } catch {
      // AI didn't return valid JSON
    }
  }

  // Fallback: return matches without AI differentiation advice
  return {
    similar: ranked.map((r) => ({
      title: r.fundraiser.title,
      slug: r.fundraiser.slug,
      raisedAmount: r.fundraiser.raisedAmount,
      goalAmount: r.fundraiser.goalAmount,
      differentiation: "Focus on what makes your campaign unique — your specific story, location, or impact.",
    })),
  };
}
