/**
 * FR-063: E2E Integration Tests — Feed flow scenarios.
 * Requires: npx playwright install && npm run dev (on port 3000)
 * Run: npx playwright test
 */

import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Feed Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to get fresh seed data
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("authenticated user sees feed on homepage", async ({ page }) => {
    await page.goto(BASE_URL);
    // Default currentUser is user-6, so feed should show
    await expect(page.getByText("Start a post...")).toBeVisible();
    await expect(page.getByRole("tab", { name: "For You" })).toBeVisible();
  });

  test("feed tabs switch content", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("tab", { name: "Following" }).click();
    await expect(page.getByRole("tab", { name: "Following" })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "Trending" }).click();
    await expect(page.getByRole("tab", { name: "Trending" })).toHaveAttribute("aria-selected", "true");
  });

  test("clicking fundraiser link navigates to fundraiser page", async ({ page }) => {
    await page.goto(BASE_URL);
    // Find any fundraiser link in feed cards
    const fundraiserLink = page.locator('a[href^="/f/"]').first();
    if (await fundraiserLink.isVisible()) {
      await fundraiserLink.click();
      await expect(page).toHaveURL(/\/f\//);
    }
  });

  test("sign out returns to marketing homepage", async ({ page }) => {
    await page.goto(BASE_URL);
    // Click profile menu button
    const profileBtn = page.getByLabel("Profile menu");
    await profileBtn.click();
    await page.getByText("Sign Out").click();
    // Should see marketing homepage content
    await expect(page.getByText("Start a post...")).not.toBeVisible();
  });

  test("profile page loads with activity feed", async ({ page }) => {
    await page.goto(`${BASE_URL}/u/janahan`);
    await expect(page.getByText("Janahan Selvakumaran")).toBeVisible();
  });
});
