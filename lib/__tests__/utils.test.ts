import { describe, it, expect } from "vitest";
import { calculateProgress, formatCurrency } from "@/lib/utils";

describe("calculateProgress", () => {
  it("returns correct percentage", () => {
    expect(calculateProgress(500, 1000)).toBe(50);
  });

  it("caps at 100 for overfunded campaigns", () => {
    expect(calculateProgress(1500, 1000)).toBe(100);
  });

  it("returns 0 when goal is 0", () => {
    expect(calculateProgress(500, 0)).toBe(0);
  });

  it("returns 0 when both are 0", () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it("returns 0 when raised is 0", () => {
    expect(calculateProgress(0, 1000)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculateProgress(333, 1000)).toBe(33);
    expect(calculateProgress(666, 1000)).toBe(67);
  });
});

describe("formatCurrency", () => {
  it("formats whole numbers with dollar sign", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats large numbers with commas", () => {
    expect(formatCurrency(1234567)).toBe("$1,234,567");
  });
});
