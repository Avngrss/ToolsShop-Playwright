import { test, expect } from "@playwright/test";
import { setAllureMeta } from "../../../utils/allure-utils";
import { PAGINATION_TESTS } from "../../../test-data/pagination.data";
import { validateSchema } from "../../../utils/validateSchema";
import { filterSchema } from "../../../schemas/filter.schema";

const MIN_PER_PAGE = 1;
const MAX_PER_PAGE = 9;

test.describe(
  "Product Pagination API",
  { tag: ["@api", "@pagination"] },
  () => {
    for (const testData of PAGINATION_TESTS) {
      test(testData.description, async ({ request }) => {
        test.skip(testData.skip ?? false, "Test skipped");

        await setAllureMeta({
          title: `Pagination - ${testData.name}`,
          description: testData.description,
          severity: testData.priority === "P0" ? "critical" : "normal",
          priority: testData.priority,
          owner: "QA Team",
          suite: "Products",
          feature: "Pagination",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "GET /products",
            QueryParams: testData.url,
            ExpectedPage: testData.expectedPage.toString(),
            ExpectedPerPage: testData.expectedPerPage.toString(),
          },
        });

        await test.step("Send paginated request", async () => {
          const response = await request.get(testData.url);
          expect(response.status()).toBe(200);

          const json = await response.json();
          validateSchema(json, filterSchema);

          expect(json.current_page).toBe(testData.expectedPage);
          expect(json.per_page).toBeGreaterThanOrEqual(MIN_PER_PAGE);
          expect(json.per_page).toBeLessThanOrEqual(MAX_PER_PAGE);
          if (
            testData.expectedPerPage >= MIN_PER_PAGE &&
            testData.expectedPerPage <= MAX_PER_PAGE
          ) {
            if (json.per_page !== testData.expectedPerPage) {
              expect(json.per_page).toBe(MAX_PER_PAGE);
            }
          }

          expect(json.total).toBeGreaterThanOrEqual(0);
          expect(json.last_page).toBeGreaterThanOrEqual(0);

          if (json.data.length > 0) {
            expect(json.data.length).toBeLessThanOrEqual(json.per_page);
            if (json.from !== null && json.to !== null) {
              expect(json.to - json.from + 1).toBe(json.data.length);
              expect(json.from).toBeGreaterThanOrEqual(1);
            }
          } else {
            console.log(`${testData.name}: Empty data (DB might be empty)`);
          }
        });
      });
    }

    test("Request page beyond last_page returns empty or last page", async ({
      request,
    }) => {
      await setAllureMeta({
        title: "Pagination - Beyond Last Page",
        description:
          "Verify graceful handling when requesting non-existent page",
        severity: "normal",
        priority: "P2",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          ExpectedBehavior: "Return empty data or last available page",
        },
      });

      await test.step("Get last_page from first request", async () => {
        const firstRes = await request.get("/products?page=0&is_rental=false");
        const firstJson = await firstRes.json();
        const lastPage = firstJson.last_page;
        const beyondUrl = `/products?page=${lastPage + 10}&is_rental=false`;
        const response = await request.get(beyondUrl);

        expect(response.status()).toBe(200);
        const json = await response.json();
        validateSchema(json, filterSchema);
        if (json.data.length === 0) {
          expect(json.current_page).toBeGreaterThanOrEqual(lastPage);
        } else {
          expect(json.current_page).toBeLessThanOrEqual(lastPage);
        }
      });
    });

    test("Invalid page parameter (string) handled gracefully", async ({
      request,
    }) => {
      await setAllureMeta({
        title: "Pagination - Invalid Page Type",
        description:
          "Verify server handles non-numeric page parameter without crashing",
        severity: "normal",
        priority: "P2",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          QueryParams: "page=invalid&is_rental=false",
          ExpectedStatus: "200 or 400",
        },
      });

      await test.step("Send request with string page", async () => {
        const response = await request.get(
          "/products?page=invalid&is_rental=false",
        );
        expect([200, 400]).toContain(response.status());

        if (response.status() === 200) {
          const json = await response.json();
          validateSchema(json, filterSchema);
          expect(json.current_page).toBeGreaterThanOrEqual(0);
        }
      });
    });

    test("Negative page parameter handled gracefully", async ({ request }) => {
      await setAllureMeta({
        title: "Pagination - Negative Page",
        description:
          "Verify server handles negative page parameter without crashing",
        severity: "normal",
        priority: "P2",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          QueryParams: "page=-1&is_rental=false",
          ExpectedStatus: "200 or 400",
        },
      });
      await test.step("Send request with negative page", async () => {
        const response = await request.get("/products?page=-1&is_rental=false");
        expect([200, 400]).toContain(response.status());

        if (response.status() === 200) {
          const json = await response.json();
          validateSchema(json, filterSchema);
          expect(json.current_page).toBeGreaterThanOrEqual(0);
        }
      });
    });

    test("Zero or negative per_page handled gracefully", async ({
      request,
    }) => {
      await test.step("Send request with per_page=0", async () => {
        await setAllureMeta({
          title: "Pagination - Zero or Negative per_page",
          description:
            "Verify server handles zero or negative per_page without crashing",
          severity: "normal",
          priority: "P2",
          owner: "QA Team",
          suite: "Products",
          feature: "Pagination",
          qaseCaseId: "",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "GET /products",
            QueryParams: "per_page=0 | per_page=-5&is_rental=false",
            ExpectedStatus: "200 or 400",
            ExpectedBehavior:
              "Return valid per_page within limits or error response",
          },
        });

        const response = await request.get(
          "/products?per_page=0&is_rental=false",
        );
        expect([200, 400]).toContain(response.status());

        if (response.status() === 200) {
          const json = await response.json();
          validateSchema(json, filterSchema);
          expect(json.per_page).toBeGreaterThan(0);
          expect(json.per_page).toBeLessThanOrEqual(MAX_PER_PAGE);
        }
      });

      await test.step("Send request with negative per_page", async () => {
        const response = await request.get(
          "/products?per_page=-5&is_rental=false",
        );
        expect([200, 400]).toContain(response.status());
      });
    });

    test("Huge per_page parameter does not cause DoS", async ({ request }) => {
      await setAllureMeta({
        title: "Pagination - Huge per_page DoS Protection",
        description: "Verify backend caps huge per_page values to prevent DoS",
        severity: "normal",
        priority: "P2",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          QueryParams: "per_page=9999&is_rental=false",
          ExpectedMaxPerPage: MAX_PER_PAGE.toString(),
        },
      });

      await test.step("Send request with per_page=9999", async () => {
        const response = await request.get(
          "/products?per_page=9999&is_rental=false",
        );
        expect([200, 400]).toContain(response.status());

        if (response.status() === 200) {
          const json = await response.json();
          validateSchema(json, filterSchema);
          expect(json.per_page).toBeLessThanOrEqual(MAX_PER_PAGE);
        }
      });
    });

    test("Pagination metadata consistency check", async ({ request }) => {
      await setAllureMeta({
        title: "Pagination - Metadata Consistency",
        description:
          "Verify from/to/total math is correct in pagination response",
        severity: "normal",
        priority: "P2",
        owner: "QA Team",
        suite: "Products",
        feature: "Pagination",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          QueryParams: "page=2&per_page=5&is_rental=false",
        },
      });
      await test.step("Verify from/to/total math is correct", async () => {
        const response = await request.get(
          "/products?page=2&per_page=5&is_rental=false",
        );
        const json = await response.json();
        validateSchema(json, filterSchema);

        if (json.data.length > 0 && json.from !== null && json.to !== null) {
          expect(json.to - json.from + 1).toBe(json.data.length);
          const expectedFrom = (json.current_page - 1) * json.per_page + 1;
          expect(json.from).toBe(expectedFrom);
        }
      });
    });
  },
);
