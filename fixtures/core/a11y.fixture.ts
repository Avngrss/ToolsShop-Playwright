import { test as base, expect } from "./test-base.fixture";
import AxeBuilder from "@axe-core/playwright";
import type { AxeResults } from "axe-core";
import type { A11ySeverity, A11yFixtures } from "../../types/a11y";

export const test = base.extend<A11yFixtures>({
  checkA11y: async ({ page }, use) => {
    await use(async (pageName, options = {}) => {
      const {
        severities = ["critical", "serious", "moderate"],
        strict = true,
        debug = false,
      } = options;
      await page.waitForSelector("body", { state: "visible" });
      await page.waitForTimeout(300);
      const axe = new AxeBuilder({ page });
      const results = await axe.analyze();
      if (severities.length)
        results.violations = results.violations.filter((v) =>
          severities.includes(v.impact as A11ySeverity),
        );
      if (debug && results.violations.length > 0)
        console.log(
          `♿ [${pageName}] Found ${results.violations.length} violations:`,
          results.violations.map((v) => v.id).join(", "),
        );
      if (results.violations.length > 0)
        await test.info().attach(`♿ A11y Report: ${pageName}`, {
          body: formatA11yReport(results, pageName),
          contentType: "text/plain",
        });
      if (strict)
        expect(
          results.violations,
          `A11y violations found on ${pageName} (strict mode)`,
        ).toHaveLength(0);
      return results;
    });
  },
});

function formatA11yReport(results: AxeResults, pageName: string): string {
  const lines = [
    `♿ Accessibility Audit: ${pageName}`,
    `URL: ${results.url}`,
    `Timestamp: ${new Date().toLocaleString()}`,
    `Violations found: ${results.violations.length}`,
    "",
  ];
  for (const v of results.violations) {
    lines.push(
      `❗ [${v.impact?.toUpperCase()}] ${v.id}: ${v.help}`,
      `   🔗 ${v.helpUrl}`,
      `   📍 Elements: ${v.nodes.length}`,
    );
    v.nodes
      .slice(0, 3)
      .forEach((n) => lines.push(`      • ${n.target.join(" > ")}`));
    if (v.nodes[0]?.failureSummary)
      lines.push(`   💬 Fix: ${v.nodes[0].failureSummary}`);
    lines.push("");
  }
  return lines.join("\n");
}

export { expect } from "@playwright/test";
