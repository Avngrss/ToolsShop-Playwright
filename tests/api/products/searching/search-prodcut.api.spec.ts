import { test, expect } from "@playwright/test";
import { validateSchema } from "../../../../utils/validateSchema";
import { ProductResponseSchema } from "../../../../schemas/product-response.schema";

test.describe("Search product", { tag: ["@api", "@search"] }, () => {
  test("Search a single product", async ({ request }) => {
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
    const query = "nonexistent_product_123";
    const response = await request.get(`/products/search?q=${query}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    const parsed = validateSchema(json, ProductResponseSchema);
    expect(parsed.data).toHaveLength(0);
  });
});
