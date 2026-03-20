"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import type { CauseCategory } from "@/lib/data";
import { FUNDRAISER_COVER_PRESETS } from "@/lib/data";
import { getStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type {
  GoalSuggestion,
  StorySuggestion,
  CategorySuggestion,
  SimilarFundraisersResult,
} from "@/lib/ai/creation-assistant";

const CAUSE_CATEGORIES: CauseCategory[] = [
  "Disaster Relief & Wildfire Safety",
  "Medical & Healthcare",
];

const STATIC_TIPS = [
  "Fundraisers with stories over 300 words raise 2x more.",
  "Include specific numbers — how many people will be helped?",
  "Add a personal quote from someone affected by the cause.",
  "Explain exactly how the funds will be used.",
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function callTool<T>(tool: string, params: Record<string, string>): Promise<T> {
  const res = await fetch("/api/ai/creation-assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, params }),
  });
  if (!res.ok) throw new Error(`AI tool failed: ${res.status}`);
  return res.json();
}

function GoalResult({ data, onApply }: { data: GoalSuggestion; onApply: (v: number) => void }) {
  if (!data.suggestedGoal) return null;
  return (
    <div className="mt-2 rounded-xl border border-brand bg-brand-mint p-3 text-body-sm">
      <p className="font-bold text-positive">
        Suggested goal: {formatCurrency(data.suggestedGoal)}
      </p>
      <p className="mt-1 text-positive">{data.reasoning}</p>
      {data.similarCount > 0 && (
        <p className="mt-1 text-body-xs text-brand">
          Based on {data.similarCount} similar campaign{data.similarCount !== 1 ? "s" : ""}
        </p>
      )}
      <button
        type="button"
        onClick={() => onApply(data.suggestedGoal)}
        className="hrt-btn-primary-sm mt-2 px-3"
      >
        Apply suggestion
      </button>
    </div>
  );
}

function StoryResult({ data }: { data: StorySuggestion }) {
  return (
    <div className="mt-2 rounded-xl border border-[#FFD863] bg-surface-warm p-3 text-body-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-warning">
          Clarity score: {data.clarityScore}/10
        </span>
      </div>
      {data.missingElements.length > 0 && (
        <div className="mt-2">
          <p className="text-body-xs font-bold text-warning">Missing elements:</p>
          <ul className="mt-1 list-disc pl-4 text-body-xs text-warning">
            {data.missingElements.map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
        </div>
      )}
      {data.suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-body-xs font-bold text-warning">Suggestions:</p>
          <ul className="mt-1 list-disc pl-4 text-body-xs text-warning">
            {data.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.aeoPrompts.length > 0 && (
        <div className="mt-2 border-t border-[#FFD863] pt-2">
          <p className="text-body-xs font-bold text-warning">Try answering these in your story:</p>
          <ul className="mt-1 list-disc pl-4 text-body-xs text-warning italic">
            {data.aeoPrompts.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CategoryResult({
  data,
  onApply,
}: {
  data: CategorySuggestion;
  onApply: (c: CauseCategory) => void;
}) {
  return (
    <div className="mt-2 rounded-xl border border-[#A7E3E3] bg-[#E1F6F6] p-3 text-body-sm">
      <p className="font-bold text-informative">
        Suggested: {data.category}{" "}
        <span className="text-body-xs">
          ({Math.round(data.confidence * 100)}% confidence)
        </span>
      </p>
      <p className="mt-1 text-informative">{data.reasoning}</p>
      <button
        type="button"
        onClick={() => onApply(data.category)}
        className="mt-2 rounded-pill bg-informative px-3 py-1 text-body-xs font-bold text-white hover:opacity-90"
      >
        Apply suggestion
      </button>
    </div>
  );
}

function SimilarResult({ data }: { data: SimilarFundraisersResult }) {
  if (data.similar.length === 0) {
    return (
      <div className="mt-2 rounded-xl border border-neutral-border bg-surface-subtle p-3 text-body-sm text-supporting">
        No similar fundraisers found — your campaign is unique!
      </div>
    );
  }
  return (
    <div className="mt-2 rounded-xl border border-[#ECCFF6] bg-[#ECCFF6]/30 p-3 text-body-sm">
      <p className="font-bold text-feature">Similar fundraisers:</p>
      <ul className="mt-2 space-y-2">
        {data.similar.map((s) => (
          <li key={s.slug} className="rounded-xl bg-white/60 p-2">
            <Link
              href={`/f/${s.slug}`}
              className="font-bold text-feature hover:text-brand"
              target="_blank"
            >
              {s.title}
            </Link>
            <p className="text-body-xs text-feature">
              {formatCurrency(s.raisedAmount)} of {formatCurrency(s.goalAmount)}
            </p>
            <p className="mt-1 text-body-xs text-feature italic">{s.differentiation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CreateFundraiserPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [story, setStory] = useState("");
  const [causeCategory, setCauseCategory] = useState<CauseCategory | "">("");
  const [communityId, setCommunityId] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState<string>(FUNDRAISER_COVER_PRESETS[0].url);
  const [organizerId, setOrganizerId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [aiAssist, setAiAssist] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [goalResult, setGoalResult] = useState<GoalSuggestion | null>(null);
  const [storyResult, setStoryResult] = useState<StorySuggestion | null>(null);
  const [categoryResult, setCategoryResult] = useState<CategorySuggestion | null>(null);
  const [similarResult, setSimilarResult] = useState<SimilarFundraisersResult | null>(null);

  const usersMap = useFundRightStore((s) => s.users);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const users = Object.values(usersMap);
  const communities = Object.values(communitiesMap);

  const effectiveOrganizerId = organizerId || users[0]?.id || "";

  const runTool = useCallback(async <T,>(
    toolName: string,
    params: Record<string, string>,
    setter: (v: T) => void
  ) => {
    setLoading((p) => ({ ...p, [toolName]: true }));
    try {
      const result = await callTool<T>(toolName, params);
      setter(result);
    } catch {
      // Tool results are optional
    } finally {
      setLoading((p) => ({ ...p, [toolName]: false }));
    }
  }, []);

  const handleSuggestGoal = () => {
    runTool<GoalSuggestion>("suggestGoalAmount", {
      category: causeCategory || "Disaster Relief & Wildfire Safety",
      communityId,
    }, setGoalResult);
  };

  const handleEnhanceStory = () => {
    if (wordCount(story) < 10) return;
    runTool<StorySuggestion>("enhanceStory", { story }, setStoryResult);
  };

  const handleAssignCategory = () => {
    if (!title.trim()) return;
    runTool<CategorySuggestion>("assignCategory", {
      title,
      story: story.slice(0, 500),
    }, setCategoryResult);
  };

  const handleSearchSimilar = () => {
    if (!title.trim()) return;
    runTool<SimilarFundraisersResult>("searchSimilarFundraisers", {
      title,
      story: story.slice(0, 500),
    }, setSimilarResult);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length > 80) newErrors.title = "Title must be 80 characters or less.";

    const goal = Number(goalAmount);
    if (Number.isNaN(goal) || goal < 100) newErrors.goalAmount = "Goal must be at least $100.";

    const words = wordCount(story);
    if (words < 50) newErrors.story = `Story must be at least 50 words (currently ${words}).`;

    if (!causeCategory) newErrors.causeCategory = "Please select a cause category.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    const result = getStore().getState().addFundraiser({
      title: title.trim(),
      goalAmount: goal,
      story: story.trim(),
      organizerId: effectiveOrganizerId,
      causeCategory: causeCategory as CauseCategory,
      communityId: communityId || undefined,
      heroImageUrl,
    });

    setSubmitting(false);
    if (result) router.push(`/f/${result.slug}?new=1`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-heading-xl sm:text-display-sm text-heading">
          Start a FundRight
        </h1>
        <p className="mt-2 text-body-md text-supporting">
          Create your campaign. It will appear on the homepage, in browse, and on your profile.
        </p>
      </div>

      {/* AI Assist toggle */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-border bg-surface-subtle px-4 py-3">
        <div>
          <p className="text-body-sm font-bold text-heading">AI Assist</p>
          <p className="text-body-xs text-supporting">
            Get AI-powered suggestions for your campaign
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={aiAssist}
          onClick={() => setAiAssist(!aiAssist)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-pill border-2 border-transparent transition-colors duration-hrt ease-hrt ${
            aiAssist ? "bg-brand" : "bg-neutral-border"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-pill bg-white shadow-soft transition-transform duration-hrt ease-hrt ${
              aiAssist ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Static tips */}
      {!aiAssist && (
        <div className="rounded-xl border border-neutral-border bg-surface-subtle p-4">
          <p className="text-body-sm font-bold text-heading mb-2">Tips for a stronger campaign:</p>
          <ul className="list-disc pl-4 space-y-1 text-body-sm text-supporting">
            {STATIC_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-body-sm font-bold text-heading">
            Campaign title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
            placeholder="e.g. Real-Time Alerts for Wildfire Safety"
          />
          <p className="mt-1 text-body-xs text-supporting">{title.length}/80</p>
          {errors.title && <p className="mt-1 text-body-sm text-negative">{errors.title}</p>}

          {aiAssist && title.trim().length > 5 && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAssignCategory}
                disabled={loading.assignCategory}
                className="hrt-tag-informative px-3 py-1 cursor-pointer hover:opacity-80 disabled:opacity-50"
              >
                {loading.assignCategory ? "Analyzing..." : "Suggest category"}
              </button>
              <button
                type="button"
                onClick={handleSearchSimilar}
                disabled={loading.searchSimilarFundraisers}
                className="hrt-tag-feature px-3 py-1 cursor-pointer hover:opacity-80 disabled:opacity-50"
              >
                {loading.searchSimilarFundraisers ? "Searching..." : "Find similar campaigns"}
              </button>
            </div>
          )}
          {categoryResult && <CategoryResult data={categoryResult} onApply={(c) => { setCauseCategory(c); setCategoryResult(null); }} />}
          {similarResult && <SimilarResult data={similarResult} />}
        </div>

        {/* Goal */}
        <div>
          <label htmlFor="goalAmount" className="block text-body-sm font-bold text-heading">
            Goal amount ($)
          </label>
          <input
            id="goalAmount"
            type="number"
            min={100}
            step={1}
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
            placeholder="100"
          />
          {errors.goalAmount && <p className="mt-1 text-body-sm text-negative">{errors.goalAmount}</p>}

          {aiAssist && (
            <button
              type="button"
              onClick={handleSuggestGoal}
              disabled={loading.suggestGoalAmount}
              className="hrt-tag-positive mt-2 px-3 py-1 cursor-pointer hover:opacity-80 disabled:opacity-50"
            >
              {loading.suggestGoalAmount ? "Calculating..." : "Suggest goal amount"}
            </button>
          )}
          {goalResult && (
            <GoalResult
              data={goalResult}
              onApply={(v) => { setGoalAmount(String(v)); setGoalResult(null); }}
            />
          )}
        </div>

        {/* Story */}
        <div>
          <label htmlFor="story" className="block text-body-sm font-bold text-heading">
            Story
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={8}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
            placeholder="Explain your cause, who it helps, and why now. 300+ words is recommended for stronger impact."
          />
          <p className="mt-1 text-body-xs text-supporting">
            {wordCount(story)} words (min 50, 300+ recommended)
          </p>
          {errors.story && <p className="mt-1 text-body-sm text-negative">{errors.story}</p>}

          {aiAssist && wordCount(story) >= 10 && (
            <button
              type="button"
              onClick={handleEnhanceStory}
              disabled={loading.enhanceStory}
              className="hrt-tag-warning mt-2 px-3 py-1 cursor-pointer hover:opacity-80 disabled:opacity-50"
            >
              {loading.enhanceStory ? "Analyzing story..." : "Get story suggestions"}
            </button>
          )}
          {storyResult && <StoryResult data={storyResult} />}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="causeCategory" className="block text-body-sm font-bold text-heading">
            Cause category
          </label>
          <select
            id="causeCategory"
            value={causeCategory}
            onChange={(e) => setCauseCategory(e.target.value as CauseCategory | "")}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
          >
            <option value="">Select a category</option>
            {CAUSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.causeCategory && <p className="mt-1 text-body-sm text-negative">{errors.causeCategory}</p>}
        </div>

        {/* Community */}
        <div>
          <label htmlFor="communityId" className="block text-body-sm font-bold text-heading">
            Community (optional)
          </label>
          <select
            id="communityId"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
          >
            <option value="">No community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover image */}
        <div>
          <span className="block text-body-sm font-bold text-heading">Cover image</span>
          <p className="mt-1 text-body-xs text-supporting">Choose a preset image for your campaign.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {FUNDRAISER_COVER_PRESETS.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setHeroImageUrl(preset.url)}
                className={`relative h-20 w-28 overflow-hidden rounded-xl border-2 transition-all duration-hrt ease-hrt ${
                  heroImageUrl === preset.url ? "border-brand ring-2 ring-brand/20" : "border-neutral-border hover:border-supporting"
                }`}
              >
                <Image
                  src={preset.url}
                  alt={preset.label}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Organizer */}
        <div>
          <label htmlFor="organizerId" className="block text-body-sm font-bold text-heading">
            Donating as (organizer)
          </label>
          <select
            id="organizerId"
            value={effectiveOrganizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-border px-4 py-2.5 text-heading focus:border-heading focus:ring-1 focus:ring-heading"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} (@{u.username})
              </option>
            ))}
          </select>
          <p className="mt-1 text-body-xs text-supporting">This person will be listed as the organizer.</p>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="hrt-btn-primary-lg px-8 disabled:opacity-50"
          >
            {submitting ? "Creating\u2026" : "Create Fundraiser"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="hrt-btn-secondary px-8 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
