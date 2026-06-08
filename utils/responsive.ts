import { expect, Page, TestInfo } from "@playwright/test";

export type ViewportType = "desktop" | "tablet" | "mobile";

export function getViewportType(projectName: string): ViewportType {
  if (
    projectName.includes("mobile") ||
    projectName.includes("android") ||
    projectName.includes("ios")
  ) {
    return "mobile";
  }
  if (projectName.includes("tablet") || projectName.includes("ipad")) {
    return "tablet";
  }
  return "desktop";
}

export function isMobileOrTablet(testInfo: TestInfo): boolean {
  const type = getViewportType(testInfo.project.name);
  return type === "mobile" || type === "tablet";
}

export function isPhone(testInfo: TestInfo): boolean {
  return getViewportType(testInfo.project.name) === "mobile";
}

export function isDesktop(testInfo: TestInfo): boolean {
  return getViewportType(testInfo.project.name) === "desktop";
}

export async function waitForVisualStability(page: Page, timeout = 300) {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(timeout);
}

export async function assertNoHorizontalScroll(page: Page) {
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "auto");
  const body = page.locator("body");
  const bodyWidth = await body.evaluate((el) => el.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
}

export function getScreenshotSuffix(projectName: string): string {
  const type = getViewportType(projectName);
  if (projectName.includes("android")) return "android";
  if (projectName.includes("ios")) return "ios";
  if (projectName.includes("tablet")) return "tablet";
  if (projectName.includes("firefox")) return "firefox";
  if (projectName.includes("webkit")) return "webkit";
  return "desktop";
}
