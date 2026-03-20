import { describe, it, expect, beforeEach } from "vitest";
import { TEST_HERO_IMAGE_URL } from "@/lib/data";
import { createFundRightStore, type Store } from "@/lib/store";

let store: ReturnType<typeof createFundRightStore>;
const getState = () => store.getState();

/** Helpers to grab known seed entities. */
function firstFundraiser() {
  return Object.values(getState().fundraisers)[0];
}
function firstUser() {
  return Object.values(getState().users)[0];
}
function secondUser() {
  return Object.values(getState().users)[1];
}

beforeEach(() => {
  store = createFundRightStore();
});

// ---------------------------------------------------------------------------
// addDonation
// ---------------------------------------------------------------------------
describe("addDonation", () => {
  it("creates a donation and updates fundraiser, donor, and community atomically", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const community = fund.communityId
      ? getState().communities[fund.communityId]
      : undefined;

    const prevRaised = fund.raisedAmount;
    const prevDonorTotal = donor.totalDonated;
    const prevCommunityRaised = community?.totalRaised ?? 0;
    const prevDonationCount = fund.donationCount;

    const donationId = getState().addDonation(fund.id, 75, donor.id, "Great cause!");

    expect(donationId).toBeTruthy();

    const state = getState();

    // Donation exists
    const donation = state.donations[donationId!];
    expect(donation).toBeDefined();
    expect(donation.amount).toBe(75);
    expect(donation.donorId).toBe(donor.id);
    expect(donation.fundraiserId).toBe(fund.id);
    expect(donation.message).toBe("Great cause!");
    expect(donation.createdAt).toBeTruthy();

    // Fundraiser updated
    const updatedFund = state.fundraisers[fund.id];
    expect(updatedFund.raisedAmount).toBe(prevRaised + 75);
    expect(updatedFund.donationCount).toBe(prevDonationCount + 1);
    expect(updatedFund.donationIds).toContain(donationId);

    // Donor updated
    const updatedDonor = state.users[donor.id];
    expect(updatedDonor.totalDonated).toBe(prevDonorTotal + 75);
    expect(updatedDonor.donationIds).toContain(donationId);

    // Community updated (if applicable)
    if (fund.communityId) {
      const updatedCommunity = state.communities[fund.communityId];
      expect(updatedCommunity.totalRaised).toBe(prevCommunityRaised + 75);
      expect(updatedCommunity.donationCount).toBeGreaterThan(0);
    }
  });

  it("handles overfunding — raisedAmount can exceed goalAmount", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const overfundAmount = fund.goalAmount * 2;

    const donationId = getState().addDonation(fund.id, overfundAmount, donor.id);

    expect(donationId).toBeTruthy();
    const updatedFund = getState().fundraisers[fund.id];
    expect(updatedFund.raisedAmount).toBeGreaterThan(fund.goalAmount);
  });

  it("returns null for invalid fundraiser ID", () => {
    const donor = firstUser();
    const prevState = getState();

    const result = getState().addDonation("nonexistent-fund", 50, donor.id);

    expect(result).toBeNull();
    // State unchanged — same fundraiser count
    expect(Object.keys(getState().donations).length).toBe(
      Object.keys(prevState.donations).length
    );
  });

  it("returns null for invalid donor ID", () => {
    const fund = firstFundraiser();
    const prevState = getState();

    const result = getState().addDonation(fund.id, 50, "nonexistent-user");

    expect(result).toBeNull();
    expect(Object.keys(getState().donations).length).toBe(
      Object.keys(prevState.donations).length
    );
  });

  it("returns null for zero amount", () => {
    const fund = firstFundraiser();
    const donor = firstUser();

    expect(getState().addDonation(fund.id, 0, donor.id)).toBeNull();
  });

  it("returns null for negative amount", () => {
    const fund = firstFundraiser();
    const donor = firstUser();

    expect(getState().addDonation(fund.id, -10, donor.id)).toBeNull();
  });

  it("creates donation without message when message is omitted", () => {
    const fund = firstFundraiser();
    const donor = secondUser();

    const donationId = getState().addDonation(fund.id, 25, donor.id);

    expect(donationId).toBeTruthy();
    const donation = getState().donations[donationId!];
    expect(donation.message).toBeUndefined();
  });

  it("does not update community when fundraiser has no communityId", () => {
    // Create a fundraiser without a community
    const organizer = firstUser();
    const result = getState().addFundraiser({
      title: "Solo Fundraiser",
      goalAmount: 1000,
      story: "A test fundraiser with no community.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });
    expect(result).toBeTruthy();

    const communitySnapshot = { ...getState().communities };
    const donor = secondUser();

    getState().addDonation(result!.id, 50, donor.id);

    // Communities should be unchanged
    for (const [id, community] of Object.entries(getState().communities)) {
      if (communitySnapshot[id]) {
        expect(community.totalRaised).toBe(communitySnapshot[id].totalRaised);
      }
    }
  });

  it("handles multiple sequential donations correctly", () => {
    const fund = firstFundraiser();
    const donor = secondUser();
    const initialRaised = fund.raisedAmount;
    const initialCount = fund.donationCount;

    getState().addDonation(fund.id, 10, donor.id);
    getState().addDonation(fund.id, 20, donor.id);
    getState().addDonation(fund.id, 30, donor.id);

    const updated = getState().fundraisers[fund.id];
    expect(updated.raisedAmount).toBe(initialRaised + 60);
    expect(updated.donationCount).toBe(initialCount + 3);
  });
});

// ---------------------------------------------------------------------------
// addFundraiser
// ---------------------------------------------------------------------------
describe("addFundraiser", () => {
  it("creates a fundraiser with correct initial values", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "Test Campaign",
      goalAmount: 5000,
      story: "This is a test fundraiser story.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    expect(result!.id).toBeTruthy();
    expect(result!.slug).toBe("test-campaign");

    const fund = getState().fundraisers[result!.id];
    expect(fund.title).toBe("Test Campaign");
    expect(fund.goalAmount).toBe(5000);
    expect(fund.raisedAmount).toBe(0);
    expect(fund.donationCount).toBe(0);
    expect(fund.donationIds).toEqual([]);
    expect(fund.organizerId).toBe(organizer.id);
    expect(fund.causeCategory).toBe("Medical & Healthcare");
  });

  it("updates community fundraiserIds and count when communityId provided", () => {
    const organizer = firstUser();
    const community = Object.values(getState().communities)[0];
    const prevCount = community.fundraiserCount;
    const prevIds = community.fundraiserIds.length;

    const result = getState().addFundraiser({
      title: "Community Fundraiser",
      goalAmount: 2000,
      story: "A fundraiser for the community.",
      organizerId: organizer.id,
      causeCategory: community.causeCategory,
      communityId: community.id,
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    const updatedCommunity = getState().communities[community.id];
    expect(updatedCommunity.fundraiserCount).toBe(prevCount + 1);
    expect(updatedCommunity.fundraiserIds.length).toBe(prevIds + 1);
    expect(updatedCommunity.fundraiserIds).toContain(result!.id);
  });

  it("returns null for invalid organizer ID", () => {
    const prevCount = Object.keys(getState().fundraisers).length;

    const result = getState().addFundraiser({
      title: "Bad Organizer",
      goalAmount: 1000,
      story: "Should not be created.",
      organizerId: "nonexistent-user",
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeNull();
    expect(Object.keys(getState().fundraisers).length).toBe(prevCount);
  });

  it("generates unique slugs for duplicate titles", () => {
    const organizer = firstUser();
    const params = {
      title: "Duplicate Title",
      goalAmount: 1000,
      story: "First fundraiser.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare" as const,
      heroImageUrl: TEST_HERO_IMAGE_URL,
    };

    const first = getState().addFundraiser(params);
    const second = getState().addFundraiser({ ...params, story: "Second fundraiser." });

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first!.slug).toBe("duplicate-title");
    expect(second!.slug).toBe("duplicate-title-2");
    expect(first!.slug).not.toBe(second!.slug);
  });

  it("handles title with special characters in slug", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "Help! Save the $100 cats & dogs!!!",
      goalAmount: 500,
      story: "Testing special characters.",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    // Slug should only contain lowercase letters, numbers, and hyphens
    expect(result!.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("trims whitespace from title and story", () => {
    const organizer = firstUser();

    const result = getState().addFundraiser({
      title: "  Spacey Title  ",
      goalAmount: 1000,
      story: "  Spacey story.  ",
      organizerId: organizer.id,
      causeCategory: "Medical & Healthcare",
      heroImageUrl: TEST_HERO_IMAGE_URL,
    });

    expect(result).toBeTruthy();
    const fund = getState().fundraisers[result!.id];
    expect(fund.title).toBe("Spacey Title");
    expect(fund.story).toBe("Spacey story.");
  });
});
