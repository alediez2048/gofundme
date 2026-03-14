"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFundRightStore } from "@/lib/store";
import type { CauseCategory } from "@/lib/data";
import { getStore } from "@/lib/store";

const PRESET_HERO_IMAGES = [
  { label: "Community / nature", url: "https://picsum.photos/seed/create-hero-1/800/450" },
  { label: "People / together", url: "https://picsum.photos/seed/create-hero-2/800/450" },
  { label: "Hope / light", url: "https://picsum.photos/seed/create-hero-3/800/450" },
  { label: "Support / hands", url: "https://picsum.photos/seed/create-hero-4/800/450" },
  { label: "Growth / cause", url: "https://picsum.photos/seed/create-hero-5/800/450" },
] as const;

const CAUSE_CATEGORIES: CauseCategory[] = [
  "Disaster Relief & Wildfire Safety",
  "Medical & Healthcare",
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CreateFundraiserPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [story, setStory] = useState("");
  const [causeCategory, setCauseCategory] = useState<CauseCategory | "">("");
  const [communityId, setCommunityId] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState<string>(PRESET_HERO_IMAGES[0].url);
  const [organizerId, setOrganizerId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const usersMap = useFundRightStore((s) => s.users);
  const communitiesMap = useFundRightStore((s) => s.communities);
  const users = Object.values(usersMap);
  const communities = Object.values(communitiesMap);

  const effectiveOrganizerId = organizerId || users[0]?.id || "";

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
    if (result) router.push(`/f/${result.slug}`);
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight sm:text-3xl">
          Start a FundRight
        </h1>
        <p className="mt-2 text-stone-600">
          Create your campaign. It will appear on the homepage, in browse, and on your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">
            Campaign title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="e.g. Real-Time Alerts for Wildfire Safety"
          />
          <p className="mt-1 text-xs text-stone-500">{title.length}/80</p>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="goalAmount" className="block text-sm font-medium text-stone-700">
            Goal amount ($)
          </label>
          <input
            id="goalAmount"
            type="number"
            min={100}
            step={1}
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="100"
          />
          {errors.goalAmount && <p className="mt-1 text-sm text-red-600">{errors.goalAmount}</p>}
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-medium text-stone-700">
            Story
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={8}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Explain your cause, who it helps, and why now. 300+ words is recommended for stronger impact."
          />
          <p className="mt-1 text-xs text-stone-500">
            {wordCount(story)} words (min 50, 300+ recommended)
          </p>
          {errors.story && <p className="mt-1 text-sm text-red-600">{errors.story}</p>}
        </div>

        <div>
          <label htmlFor="causeCategory" className="block text-sm font-medium text-stone-700">
            Cause category
          </label>
          <select
            id="causeCategory"
            value={causeCategory}
            onChange={(e) => setCauseCategory(e.target.value as CauseCategory | "")}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {CAUSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.causeCategory && <p className="mt-1 text-sm text-red-600">{errors.causeCategory}</p>}
        </div>

        <div>
          <label htmlFor="communityId" className="block text-sm font-medium text-stone-700">
            Community (optional)
          </label>
          <select
            id="communityId"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">No community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium text-stone-700">Cover image</span>
          <p className="mt-1 text-xs text-stone-500">Choose a preset image for your campaign.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {PRESET_HERO_IMAGES.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setHeroImageUrl(preset.url)}
                className={`relative h-20 w-28 overflow-hidden rounded-lg border-2 transition-colors ${
                  heroImageUrl === preset.url ? "border-primary" : "border-stone-200 hover:border-stone-300"
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

        <div>
          <label htmlFor="organizerId" className="block text-sm font-medium text-stone-700">
            Donating as (organizer)
          </label>
          <select
            id="organizerId"
            value={effectiveOrganizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} (@{u.username})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-stone-500">This person will be listed as the organizer.</p>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Fundraiser"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
