/**
 * FundRight data layer — types and seed data.
 * FR-002: Data Model & Seed Data
 */

export * from "./types";
export { seed, users, fundraisersSeed as fundraisers, communities, donations } from "./seed";
export { seedFollowRelationships, seedFeedEvents, buildFollowMaps, priyaBookmarkedIds } from "./seed-social";
export {
  FUNDRAISER_COVER_PRESETS,
  TEST_HERO_IMAGE_URL,
  communityBanner,
  demoAvatarUrl,
  fundraiserHero,
  fundraisingHeroFromSeed,
} from "./fundraising-images";
