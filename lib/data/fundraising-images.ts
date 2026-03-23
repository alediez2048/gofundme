/**
 * Curated “people-first” imagery for demos — families, community, care, hope.
 * Served from Unsplash CDN (hotlinking allowed per https://unsplash.com/license).
 * Attribution: thank you to photographers on Unsplash; suitable for FundRight demo use.
 */

function unsplashCrop(photoPath: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

/** Community-wide banners (wide). */
export const communityBanner = {
  /** Togetherness / community — good for disaster relief & mutual aid */
  mutualAid: unsplashCrop("photo-1529156069898-49953e39b3ac", 1200, 400),
  /** Cozy family moment — good for medical / healthcare network */
  familyHome: unsplashCrop("photo-1511895426328-dc8714191300", 1200, 400),
  /** Students learning together — good for education communities */
  classroom: unsplashCrop("photo-1503676260728-1c00da094a0b", 1200, 400),
  /** Reforestation / climate action — good for environment communities */
  climateAction: unsplashCrop("photo-1466611653911-95081537e5b7", 1200, 400),
  /** Animal care and rescue — good for rescue communities */
  animalCare: unsplashCrop("photo-1517849845537-4d257902454a", 1200, 400),
  /** Neighbors supporting each other — good for mutual aid communities */
  neighborsSupport: unsplashCrop("photo-1517486808906-6ca8b3f04846", 1200, 400),
  /** Outdoor youth activity — good for neighborhood community programs */
  youthPrograms: unsplashCrop("photo-1500530855697-b586d89ba3ee", 1200, 400),
  /** Ocean and shoreline stewardship — good for environmental communities */
  coastalCare: unsplashCrop("photo-1500375592092-40eb2168fd21", 1200, 400),
  /** Group study and scholarships — good for student support communities */
  scholarshipSupport: unsplashCrop("photo-1497633762265-9d179a990aa6", 1200, 400),
  /** Neighborhood food support — good for local aid communities */
  communityKitchen: unsplashCrop("photo-1488521787991-ed7bbaae773c", 1200, 400),
  /** Wildlife habitat outdoors — good for animal and habitat communities */
  wildlifeHabitat: unsplashCrop("photo-1474511320723-9a56873867b5", 1200, 400),
  /** Clean air and urban climate action — good for resilience communities */
  cleanAirAction: unsplashCrop("photo-1493246507139-91e8fad9978e", 1200, 400),
} as const;

/** Fundraiser hero covers matched to campaign tone. */
export const fundraiserHero = {
  /** Family together — safety, protection, wildfire / preparedness stories (IDs verified 200 from images.unsplash.com) */
  familySafety: unsplashCrop("photo-1522771739844-6a9f6d5f14af", 800, 450),
  /** First responder — equipment / volunteer fire drives */
  firstResponder: unsplashCrop("photo-1544735716-392fe2489ffa", 800, 450),
  /** Multi-gen family — evacuation hub, shelter, neighbors helping */
  familyTogether: unsplashCrop("photo-1609220136736-443140cffec6", 800, 450),
  /** Child-focused — medical bills, pediatric care */
  childHope: unsplashCrop("photo-1503454537195-1dcabb73ffb9", 800, 450),
  /** Hands + care — treatment support funds, healthcare */
  careSupport: unsplashCrop("photo-1576091160399-112ba8d25d1d", 800, 450),
} as const;

/**
 * Presets for the “Start a fundraiser” cover picker (same aspect as hero cards).
 */
export const FUNDRAISER_COVER_PRESETS = [
  { label: "Family at home", url: unsplashCrop("photo-1511895426328-dc8714191300", 800, 450) },
  { label: "Friends hugging", url: unsplashCrop("photo-1529156069898-49953e39b3ac", 800, 450) },
  { label: "Parent & child", url: unsplashCrop("photo-1522771739844-6a9f6d5f14af", 800, 450) },
  { label: "Happy kids", url: unsplashCrop("photo-1503454537195-1dcabb73ffb9", 800, 450) },
  { label: "Three generations", url: unsplashCrop("photo-1609220136736-443140cffec6", 800, 450) },
  { label: "Community hands together", url: unsplashCrop("photo-1491438590914-bc09fcaaf77a", 800, 450) },
  { label: "Mother & baby", url: unsplashCrop("photo-1587654780291-39c9404d746b", 800, 450) },
  { label: "Volunteers helping", url: unsplashCrop("photo-1559027615-cd4628902d4a", 800, 450) },
] as const;

const HERO_ROTATION = FUNDRAISER_COVER_PRESETS.map((p) => p.url);

/**
 * Deterministic hero URL from an arbitrary seed (e.g. slug) when you don’t pick a fixed photo.
 */
export function fundraisingHeroFromSeed(seed: string, width = 800, height = 450): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const base = HERO_ROTATION[Math.abs(hash) % HERO_ROTATION.length];
  if (width === 800 && height === 450) return base;
  try {
    const path = new URL(base).pathname.replace(/^\//, "");
    return unsplashCrop(path, width, height);
  } catch {
    return base;
  }
}

/** Use in tests or defaults; stable URL. */
export const TEST_HERO_IMAGE_URL = fundraiserHero.familySafety;

/**
 * Realistic faces for demo users (deterministic per id). Pravatar provides free stock portraits.
 * @see https://pravatar.cc
 */
export function demoAvatarUrl(userId: string, size = 256): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const img = (Math.abs(hash) % 70) + 1;
  return `https://i.pravatar.cc/${size}?img=${img}`;
}
