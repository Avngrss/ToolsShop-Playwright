import { test as base, expect } from "./cart.fixture";
import AxeBuilder from "@axe-core/playwright";
import type { AxeResults } from "axe-core";

export interface A11yFixtures {
  checkA11y: (
    pageName: string,
    options?: { severities?: string[]; strict?: boolean; debug?: boolean },
  ) => Promise<AxeResults>;
}

export const test = base.extend<A11yFixtures>({
  checkA11y: async ({ page }, use) => {
    await use(async (pageName, options = {}) => {
      const {
        severities = ["critical", "serious", "moderate"],
        strict = true,
        debug = false,
      } = options;
      await page.waitForSelector("body", { state: "visible" });
      const results = await new AxeBuilder({ page }).analyze();
      const violations = severities.length
        ? results.violations.filter((v) =>
            severities.includes(v.impact as string),
          )
        : results.violations;
      if (debug && violations.length)
        console.log(`♿ [${pageName}] ${violations.length} violations`);
      if (strict)
        expect(violations, `A11y violations on ${pageName}`).toHaveLength(0);
      return { ...results, violations };
    });
  },
});
export { expect };
