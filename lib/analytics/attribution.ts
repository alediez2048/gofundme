/**
 * FR-055: Session-level source attribution.
 * Tags each session with its traffic source for conversion tracking.
 */

export type TrafficSource = "direct" | "search" | "social" | "referral" | "internal";

export function getTrafficSource(): TrafficSource {
  if (typeof document === "undefined") return "direct";

  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (host.includes("google") || host.includes("bing") || host.includes("duckduckgo")) {
      return "search";
    }
    if (host.includes("twitter") || host.includes("facebook") || host.includes("linkedin") || host.includes("instagram")) {
      return "social";
    }
    if (host === window.location.hostname) {
      return "internal";
    }
    return "referral";
  } catch {
    return "direct";
  }
}
