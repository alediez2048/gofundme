/**
 * Behavioral learning model (FR-032).
 * Tracks user actions on feed events to refine cause preferences.
 */

import type { CauseCategory } from "@/lib/data";

export type BehaviorAction = "donate" | "heart" | "click" | "skip" | "bookmark" | "share";

export interface UserBehaviorSignals {
  donatedCauses: Record<string, number>;
  heartedCauses: Record<string, number>;
  clickedCauses: Record<string, number>;
  skippedCauses: Record<string, number>;
  lastInteractionTimes: Record<string, string>;
}

const ACTION_WEIGHTS: Record<BehaviorAction, number> = {
  donate: 1.0,
  share: 0.7,
  bookmark: 0.6,
  heart: 0.4,
  click: 0.2,
  skip: -0.1,
};

export function createEmptySignals(): UserBehaviorSignals {
  return {
    donatedCauses: {},
    heartedCauses: {},
    clickedCauses: {},
    skippedCauses: {},
    lastInteractionTimes: {},
  };
}

/** Update behavior signals based on a user action on a feed event. */
export function updateSignals(
  signals: UserBehaviorSignals,
  action: BehaviorAction,
  cause: CauseCategory
): UserBehaviorSignals {
  const updated = { ...signals };
  const weight = ACTION_WEIGHTS[action];
  const now = new Date().toISOString();

  updated.lastInteractionTimes = {
    ...updated.lastInteractionTimes,
    [cause]: now,
  };

  const bucket = getBucket(action);
  if (bucket) {
    const key = bucket as keyof Pick<UserBehaviorSignals, "donatedCauses" | "heartedCauses" | "clickedCauses" | "skippedCauses">;
    updated[key] = {
      ...updated[key],
      [cause]: (updated[key][cause] ?? 0) + Math.abs(weight),
    };
  }

  return updated;
}

function getBucket(action: BehaviorAction): string | null {
  switch (action) {
    case "donate":
    case "share":
    case "bookmark":
      return "donatedCauses";
    case "heart":
      return "heartedCauses";
    case "click":
      return "clickedCauses";
    case "skip":
      return "skippedCauses";
    default:
      return null;
  }
}

/** Exponential decay — older signals matter less (30-day half-life). */
export function decayWeight(isoTimestamp: string): number {
  const hours = (Date.now() - new Date(isoTimestamp).getTime()) / (1000 * 60 * 60);
  return Math.exp(-hours / (30 * 24)); // half-life ~20.8 days
}

/** Get the overall action weight for a behavior type. */
export function getActionWeight(action: BehaviorAction): number {
  return ACTION_WEIGHTS[action];
}
