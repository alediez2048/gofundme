/**
 * FR-024: Trust Summaries & Impact Projections.
 * Trust summaries: template-based with AEO 40-60 word extractable blocks.
 * Impact projections: pure client-side math from causeImpactMap.
 */

import type { CauseCategory, Community, Fundraiser, User } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

// ——— Trust Summary ———

export interface TrustSummary {
  text: string;
  stats: {
    campaignCount: number;
    totalRaised: number;
    donorCount: number;
    avgDonation: number;
    communities: string[];
    verified: boolean;
    joinDate: string;
  };
}

/**
 * Build a trust summary for an organizer. Template-based with AEO-optimized structure.
 * Works without an API key — pure data retrieval from store.
 */
export function buildTrustSummary(
  organizer: User,
  allFundraisers: Fundraiser[],
  allCommunities: Community[]
): TrustSummary {
  const orgFundraisers = allFundraisers.filter(
    (f) => f.organizerId === organizer.id
  );
  const totalRaised = orgFundraisers.reduce((s, f) => s + f.raisedAmount, 0);
  const totalDonors = orgFundraisers.reduce((s, f) => s + f.donationCount, 0);
  const avgDonation = totalDonors > 0 ? Math.round(totalRaised / totalDonors) : 0;

  const communityIds = new Set(
    orgFundraisers.map((f) => f.communityId).filter(Boolean)
  );
  const communities = allCommunities
    .filter((c) => communityIds.has(c.id))
    .map((c) => c.name);

  const joinYear = new Date(organizer.joinDate).getFullYear();
  const verifiedText = organizer.verified ? "Verified organizer" : "Organizer";

  // Build AEO-optimized extractable block (40-60 words)
  const parts: string[] = [];
  parts.push(
    `${organizer.name} has organized ${orgFundraisers.length} fundraiser${orgFundraisers.length !== 1 ? "s" : ""} raising ${formatCurrency(totalRaised)} total`
  );
  if (communities.length > 0) {
    parts[0] += ` across ${communities.length} communit${communities.length !== 1 ? "ies" : "y"}`;
  }
  parts[0] += ".";

  parts.push(`${verifiedText} since ${joinYear}.`);

  if (totalDonors > 0) {
    parts.push(
      `${totalDonors} donor${totalDonors !== 1 ? "s have" : " has"} contributed to ${organizer.name.split(" ")[0]}'s campaigns, with an average donation of ${formatCurrency(avgDonation)}.`
    );
  }

  if (communities.length > 0) {
    parts.push(`Active member of the ${communities.join(" and ")} communit${communities.length !== 1 ? "ies" : "y"}.`);
  }

  return {
    text: parts.join(" "),
    stats: {
      campaignCount: orgFundraisers.length,
      totalRaised,
      donorCount: totalDonors,
      avgDonation,
      communities,
      verified: organizer.verified,
      joinDate: organizer.joinDate,
    },
  };
}

// ——— Impact Projections ———

interface ImpactUnit {
  unit: string;
  rate: number; // how many units per dollar
  verb: string;
}

const causeImpactMap: Record<CauseCategory, ImpactUnit> = {
  "Disaster Relief & Wildfire Safety": {
    unit: "families",
    rate: 4, // $1 = alerts for 4 families for 1 month
    verb: "provides wildfire alerts to",
  },
  "Medical & Healthcare": {
    unit: "patients",
    rate: 0.5, // $1 = 0.5 patients helped (i.e. $2 per patient)
    verb: "helps fund treatment for",
  },
  Education: {
    unit: "students",
    rate: 2, // $1 = supplies for 2 students
    verb: "provides learning materials for",
  },
  "Environment & Climate": {
    unit: "trees",
    rate: 1, // $1 = 1 tree planted
    verb: "plants",
  },
  "Animals & Wildlife": {
    unit: "animals",
    rate: 0.25, // $1 = 0.25 animals sheltered (i.e. $4 per animal)
    verb: "helps shelter",
  },
  "Community & Neighbors": {
    unit: "neighbors",
    rate: 1.5, // $1 = meals/supplies for 1.5 people
    verb: "provides support for",
  },
};

/**
 * Generate a dynamic impact statement for a donation amount.
 * Pure client-side math, no LLM needed.
 */
export function getImpactProjection(
  amount: number,
  causeCategory: CauseCategory
): string | null {
  if (amount <= 0) return null;

  const impact = causeImpactMap[causeCategory];
  if (!impact) return null;

  const impactCount = Math.max(1, Math.round(amount * impact.rate));
  return `Your ${formatCurrency(amount)} ${impact.verb} ${impactCount} ${impact.unit}`;
}
