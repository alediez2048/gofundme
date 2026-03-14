/**
 * FR-020: Fallback registry — maps AI features to their non-AI fallback functions.
 */

type FallbackFn = (input: unknown) => unknown;

const registry = new Map<string, FallbackFn>();

export function registerFallback(feature: string, fn: FallbackFn): void {
  registry.set(feature, fn);
}

export function getFallback(feature: string): FallbackFn | undefined {
  return registry.get(feature);
}

export function hasFallback(feature: string): boolean {
  return registry.has(feature);
}
