import { AxeResults } from "axe-core";

export type A11ySeverity = "critical" | "serious" | "moderate" | "minor";

export interface A11yFixtures {
  checkA11y: (
    pageName: string,
    options?: {
      severities?: A11ySeverity[];
      strict?: boolean;
      debug?: boolean;
    },
  ) => Promise<AxeResults>;
}
