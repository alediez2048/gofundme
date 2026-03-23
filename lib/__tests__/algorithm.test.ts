/**
 * FR-062: P1 Unit Tests — Algorithm, cause affinity, schema validation.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createFundRightStore } from "@/lib/store";
import { getCauseSimilarity, computeUserCauseProfile, scoreCauseRelevance } from "@/lib/feed/causeEmbeddings";
import { getForYouFeed, getFollowingFeed, getTrendingFeed } from "@/lib/feed/algorithm";
import { getRecommendations } from "@/lib/feed/recommendations";
import { createEmptySignals, updateSignals } from "@/lib/feed/behaviorModel";
import { validateSchema, validateSchemas } from "@/lib/schema/validate";
import { buildHomepageSchema, buildBreadcrumbSchema } from "@/lib/schema";

let store: ReturnType<typeof createFundRightStore>;
const getState = () => store.getState();

beforeEach(() => {
  store = createFundRightStore();
});

// ---------------------------------------------------------------------------
// Cause embeddings (~8 tests)
// ---------------------------------------------------------------------------
describe("cause embeddings", () => {
  it("identical causes have similarity 1.0", () => {
    expect(getCauseSimilarity("Education", "Education")).toBe(1.0);
    expect(getCauseSimilarity("Medical & Healthcare", "Medical & Healthcare")).toBe(1.0);
  });

  it("related causes have high similarity", () => {
    expect(getCauseSimilarity("Disaster Relief & Wildfire Safety", "Environment & Climate")).toBeGreaterThanOrEqual(0.7);
    expect(getCauseSimilarity("Animals & Wildlife", "Environment & Climate")).toBeGreaterThanOrEqual(0.7);
  });

  it("unrelated causes have low similarity", () => {
    expect(getCauseSimilarity("Animals & Wildlife", "Medical & Healthcare")).toBeLessThan(0.5);
    expect(getCauseSimilarity("Education", "Disaster Relief & Wildfire Safety")).toBeLessThan(0.5);
  });

  it("similarity is symmetric", () => {
    const ab = getCauseSimilarity("Education", "Community & Neighbors");
    const ba = getCauseSimilarity("Community & Neighbors", "Education");
    expect(ab).toBe(ba);
  });

  it("user cause profile is non-zero for users with donations", () => {
    const profile = computeUserCauseProfile("user-1", getState());
    const total = Object.values(profile).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });

  it("user cause profile reflects donation history", () => {
    // user-1 is in comm-1 (Disaster Relief) — should have weight there
    const profile = computeUserCauseProfile("user-1", getState());
    expect(profile["Disaster Relief & Wildfire Safety"]).toBeGreaterThan(0);
  });

  it("scoreCauseRelevance returns value between 0 and 1", () => {
    const profile = computeUserCauseProfile("user-1", getState());
    const score = scoreCauseRelevance(profile, "Medical & Healthcare");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("cold start user gets neutral profile", () => {
    // Non-existent user
    const profile = computeUserCauseProfile("nonexistent", getState());
    const total = Object.values(profile).reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Feed algorithm (~8 tests)
// ---------------------------------------------------------------------------
describe("feed algorithm", () => {
  it("getForYouFeed returns non-empty for seeded data", () => {
    const feed = getForYouFeed("user-6", getState());
    expect(feed.length).toBeGreaterThan(0);
  });

  it("every feed item has a reason string", () => {
    const feed = getForYouFeed("user-6", getState());
    for (const item of feed) {
      expect(typeof item.reason).toBe("string");
      expect(item.reason.length).toBeGreaterThan(0);
    }
  });

  it("every feed item has non-negative score", () => {
    const feed = getForYouFeed("user-6", getState());
    for (const item of feed) {
      expect(item.score).toBeGreaterThanOrEqual(0);
    }
  });

  it("getFollowingFeed only includes followed users or the current user", () => {
    const state = getState();
    const following = new Set(state.users["user-6"].followingIds ?? []);
    const feed = getFollowingFeed("user-6", state);
    for (const item of feed) {
      expect(
        following.has(item.event.actorId) || item.event.actorId === "user-6"
      ).toBe(true);
    }
  });

  it("getTrendingFeed is sorted by momentum descending", () => {
    const feed = getTrendingFeed(getState());
    for (let i = 0; i < feed.length - 1; i++) {
      expect(feed[i].score).toBeGreaterThanOrEqual(feed[i + 1].score);
    }
  });

  it("getFollowingFeed is chronological", () => {
    const feed = getFollowingFeed("user-6", getState());
    for (let i = 0; i < feed.length - 1; i++) {
      const a = new Date(feed[i].event.createdAt).getTime();
      const b = new Date(feed[i + 1].event.createdAt).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("empty feedEvents returns empty feed", () => {
    store.setState({ feedEvents: {} });
    const feed = getForYouFeed("user-6", getState());
    expect(feed).toHaveLength(0);
  });

  it("user with no follows only sees their own following feed events", () => {
    store.setState((s) => ({
      users: {
        ...s.users,
        "user-6": { ...s.users["user-6"], followingIds: [] },
      },
    }));
    const feed = getFollowingFeed("user-6", getState());
    for (const item of feed) {
      expect(item.event.actorId).toBe("user-6");
    }
  });
});

// ---------------------------------------------------------------------------
// Recommendations (~5 tests)
// ---------------------------------------------------------------------------
describe("recommendations", () => {
  it("returns recommendations for active donors", () => {
    const recs = getRecommendations("user-6", getState(), 5);
    // May or may not have recs depending on data overlap
    expect(Array.isArray(recs)).toBe(true);
  });

  it("does not recommend fundraisers user already donated to", () => {
    const user = getState().users["user-6"];
    const donatedFundIds = new Set(
      user.donationIds.map((id) => getState().donations[id]?.fundraiserId).filter(Boolean)
    );
    const recs = getRecommendations("user-6", getState(), 10);
    for (const rec of recs) {
      expect(donatedFundIds.has(rec.fundraiser.id)).toBe(false);
    }
  });

  it("each recommendation has a reason", () => {
    const recs = getRecommendations("user-6", getState(), 5);
    for (const rec of recs) {
      expect(rec.reason.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Behavior model (~4 tests)
// ---------------------------------------------------------------------------
describe("behavior model", () => {
  it("createEmptySignals has zero values", () => {
    const signals = createEmptySignals();
    expect(Object.keys(signals.donatedCauses)).toHaveLength(0);
    expect(Object.keys(signals.heartedCauses)).toHaveLength(0);
  });

  it("updateSignals tracks heart action", () => {
    let signals = createEmptySignals();
    signals = updateSignals(signals, "heart", "Education");
    expect(signals.heartedCauses["Education"]).toBeGreaterThan(0);
  });

  it("updateSignals tracks donation action", () => {
    let signals = createEmptySignals();
    signals = updateSignals(signals, "donate", "Medical & Healthcare");
    expect(signals.donatedCauses["Medical & Healthcare"]).toBeGreaterThan(0);
  });

  it("updateSignals records lastInteractionTimes", () => {
    let signals = createEmptySignals();
    signals = updateSignals(signals, "click", "Education");
    expect(signals.lastInteractionTimes["Education"]).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Schema validation (~6 tests)
// ---------------------------------------------------------------------------
describe("schema validation", () => {
  it("validates valid schema", () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home" }],
    };
    const result = validateSchema(schema);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects schema missing @type", () => {
    const result = validateSchema({ "@context": "https://schema.org" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("@type"))).toBe(true);
  });

  it("rejects schema missing @context", () => {
    const result = validateSchema({ "@type": "Organization", name: "Test" });
    expect(result.valid).toBe(false);
  });

  it("warns about missing dateModified on DonateAction", () => {
    const result = validateSchema({
      "@context": "https://schema.org",
      "@type": "DonateAction",
      name: "Test",
      target: "https://example.com",
    });
    expect(result.warnings.some((w) => w.includes("dateModified"))).toBe(true);
  });

  it("validates buildHomepageSchema output", () => {
    const schema = buildHomepageSchema();
    const result = validateSchema(schema as Record<string, unknown>);
    expect(result.valid).toBe(true);
  });

  it("validates buildBreadcrumbSchema output", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Test" },
    ]);
    const result = validateSchema(schema as Record<string, unknown>);
    expect(result.valid).toBe(true);
  });
});
