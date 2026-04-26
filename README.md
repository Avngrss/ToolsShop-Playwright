# ToolsShop E2E & API Test Automation Suite

![CI/CD](https://img.shields.io/github/actions/workflow/status/Avngrss/ToolsShop-Playwright/playwright-e2e.yml?branch=main&logo=githubactions&label=CI%2FCD)
![Playwright](https://img.shields.io/badge/Playwright-1.59+-2EAD33?logo=playwright)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2.0+-2088FF?logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-8.x-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E?logo=prettier&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3.x-3E6B9B?logo=zod&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-3.x-0080C0?logo=allure&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/Avngrss/ToolsShop-Playwright?logo=git)

Production-ready automated testing framework for [ToolsShop](https://practicesoftwaretesting.com), built with **Playwright + TypeScript**. Designed around the Testing Pyramid, with CI/CD integration, contract validation, accessibility checks, and full traceability to Qase.io test cases.

## Overview

This repository contains a scalable test automation suite covering **API, UI, and End-to-End** scenarios for an e-commerce platform. The architecture prioritizes speed, reliability, and maintainability, following modern QA engineering practices:

- **Testing Pyramid**: Heavy API layer for business logic & edge cases, focused UI integration tests, and lean E2E critical journeys.
- **Requirements Traceability**: Every automated test maps to a manual test case in Qase.io. Links are embedded directly in Allure reports.
- **CI-Optimized**: Parallel execution, smart caching, auto-retries, and artifact upload for instant debugging.

---

## Architecture & Strategy

| Layer   | Coverage Focus                                                       | Tools & Patterns                                                          |
| ------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **API** | Positive/negative flows, auth, validation, error handling, contracts | `Zod` schemas, `playwright.request`, API clients, contract validation     |
| **UI**  | Component interactions, forms, navigation, visual regressions        | POM pattern, `toHaveScreenshot()`, dynamic waits, custom fixtures         |
| **E2E** | Critical user journeys (search → cart → checkout → order)            | Cross-browser matrix, `trace: on-first-retry`, `video: retain-on-failure` |

---

## Tech Stack

| Category            | Stack                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| **Framework**       | Playwright (TypeScript)                                                |
| **API/Contracts**   | Zod (runtime schema validation), Playwright `request` context          |
| **Accessibility**   | `@axe-core/playwright` (WCAG 2.2 automated scans + severity reporting) |
| **Reporting**       | Allure Report (steps, metadata, screenshots, traces, Qase links)       |
| **CI/CD**           | GitHub Actions (matrix builds, cache, artifacts, permissions)          |
| **Test Management** | Qase.io (manual → automated traceability)                              |
| **Code Quality**    | ESLint, Prettier, TypeScript strict mode                               |

---

## Reporting & Quality Gates

- **Allure HTML Dashboard**: Interactive test execution view with environment info, failure traces, screenshots, and direct Qase links.
- **Accessibility Reports**: Automated `axe-core` scans per page; violations grouped by WCAG rules, impact level, and fix recommendations.
- **Contract Validation**: Zod schemas ensure API responses match expected contracts. Mismatch → immediate test failure with detailed diff.
- **CI Artifacts**: On failure, GitHub Actions uploads:
  - Screenshots (`only-on-failure`)
  - Videos (`retain-on-failure`)
  - Playwright traces (`on-first-retry`)
  - Allure & HTML reports

---

## Project Structure

```text
toolsshop/
├── .github/workflows/        # CI/CD pipelines (GitHub Actions: matrix runs, caching, artifact upload)
├── fixtures/                 # Custom Playwright fixtures (auth state, API context, pre-test setup)
├── tests/
│   ├── api/                  # API test suites (contracts, auth, CRUD, negative/edge cases)
│   ├── ui/                   # UI feature tests (POM-driven, interactions, visual regression)
│   └── e2e/                  # Critical user journeys (search → cart → checkout → order confirmation)
├── pages/                    # Page Objects (encapsulated selectors & actions for full pages)
├── components/               # Reusable UI widgets (headers, modals, forms, product cards, tables)
├── test-data/                # Test datasets & mocks (JSON fixtures, user profiles, product catalogs)
├── schemas/                  # Zod validation schemas for API contract testing & TS type inference
├── types/                    # Shared TypeScript interfaces, enums & global type definitions
├── utils/                    # Helpers, data generators, custom matchers & formatters
├── allure-results/           # Raw Allure execution data (auto-generated, gitignored)
├── playwright.config.ts      # Core framework config (projects, timeouts, reporters, retries)
├── tsconfig.json             # TypeScript compiler options & strict mode settings
└── package.json              # Dependencies, NPM scripts & engine constraints
```

## Contract Testing Example

API responses are validated against Zod schemas to catch breaking changes early:

```ts
// contracts/product.schema.ts
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  availability: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Product = z.infer<typeof ProductSchema>;

// tests/api/products.api.spec.ts
test("GET /products/:id returns valid product", async ({ api }) => {
  const response = await api.get("/products/abc123");
  const result = ProductSchema.safeParse(response.json());

  expect(result.success).toBeTruthy();
  if (!result.success) {
    throw new Error(`Contract violation: ${result.error.format()}`);
  }
});
```

**Benefits:**

- **Type-safe API responses** — TypeScript types generated directly from Zod schemas
- **Immediate failure on schema mismatch** — clear error messages with field-level diff
- **Self-documenting test expectations** — schema serves as living API documentation

## Accessibility Checks

Accessibility Testing Example
UI test includes automated WCAG 2.2 scans via `@axe-core/playwright`:

```ts
import { injectAxe, checkA11y } from "axe-playwright";

test("Product page meets accessibility standards", async ({ page }) => {
  await page.goto("/products/hammer");
  await injectAxe(page);

  const violations = await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });

  expect(violations).toHaveLength(0);
});
```

**Violations are attached to Allure report with:**

- **WCAG rule ID & description** — e.g., `color-contrast`, `aria-required-children`
- **Impact level** — `critical` / `serious` / `moderate` / `minor`
- **HTML snippet** — exact element that failed the check
- **Fix recommendations** — actionable guidance for developers

## Test Management Integration

Each automated test links to its manual counterpart in Qase.io via metadata:

```ts
test("Add product to cart @qase:TOOLS-142", async ({ page }) => {
  test.info().annotations.push({
    type: "Qase ID",
    description: "https://app.qase.io/case/TOOLS-142",
  });
  // ... test steps
});
```

**In Allure Report:**

- Click **«Qase ID»** annotation → opens the test case directly in Qase
- Track **automation coverage** per requirement or epic
- Sync execution results back to Qase via API _(planned)_
