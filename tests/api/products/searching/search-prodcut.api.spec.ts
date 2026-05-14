import { test, expect } from "@playwright/test";
import { validateSchema } from "../../../../utils/validateSchema";
import { ProductResponseSchema } from "../../../../schemas/product-response.schema";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe("Search product", { tag: ["@api", "@search"] }, () => {
  test("Search a single product", async ({ request }) => {
    await setAllureMeta({
      title: "Search - Find Single Product",
      description:
        "Verify that searching for existing product returns 200 and results containing the query",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Products",
      feature: "Search",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "GET /products/search",
        Method: "GET",
        SearchQuery: "Bolt Cutters",
        ExpectedStatus: "200",
        ExpectedResult: "Non-empty array with matching products",
      },
    });
    const query = "Bolt";
    const searchQuery = "Bolt Cutters";
    const response = await request.get(
      `/products/search?q=${encodeURIComponent(searchQuery)}`,
    );

    await test.step("Verify status code", async () => {
      expect(response.status()).toBe(200);
    });

    await test.step("Parse and validate response with Zod", async () => {
      const json = await response.json();
      const parsed = validateSchema(json, ProductResponseSchema);
      expect(parsed.data.length).toBeGreaterThan(0);
      parsed.data.forEach((p) => {
        expect(p.name.toLowerCase()).toContain(query.toLowerCase());
      });
    });
  });

  test("Search: product not found", async ({ request }) => {
    await setAllureMeta({
      title: "Search - Product Not Found",
      description:
        "Verify that searching for non-existent product returns 200 with empty data array",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Search",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "GET /products/search",
        Method: "GET",
        SearchQuery: "nonexistent_product_123",
        ExpectedStatus: "200",
        ExpectedResult: "Empty data array",
      },
    });
    const query = "nonexistent_product_123";
    const response = await request.get(`/products/search?q=${query}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    const parsed = validateSchema(json, ProductResponseSchema);
    expect(parsed.data).toHaveLength(0);
  });
});
