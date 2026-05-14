import { test, expect } from "@playwright/test";
import {
  priceRangeCases,
  BASE_PRODUCT_QUERY,
} from "../../../../test-data/price-range-cases";
import { validateSchema } from "../../../../utils/validateSchema";
import { ProductResponseSchema } from "../../../../schemas/product-response.schema";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe(
  "Filter Products by Price Range",
  { tag: ["@api", "@filter", "@price"] },
  () => {
    for (const { min, max, label, description } of priceRangeCases) {
      test(`Price range: ${label}`, async ({ request }) => {
        await setAllureMeta({
          title: `Filters - Price Range: ${label}`,
          description: description,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Products",
          feature: "Price Filter",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "GET /products",
            Method: "GET",
            FilterType: "Price Range",
            MinPrice: min.toString(),
            MaxPrice: max.toString(),
            QueryParam: `between=price,${min},${max}`,
            ExpectedStatus: "200",
          },
        });
        const endpoint = `/products?${BASE_PRODUCT_QUERY}&between=price,${min},${max}`;

        await test.step("Send request and verify status", async () => {
          const response = await request.get(endpoint);
          expect(response.status()).toBe(200);
        });

        await test.step("Validate response structure with Zod", async () => {
          const json = await (await request.get(endpoint)).json();
          const parsed = validateSchema(json, ProductResponseSchema);
          expect(Array.isArray(parsed.data)).toBe(true);
        });

        await test.step(`Verify all products are within [${min}, ${max}]`, async () => {
          const response = await request.get(endpoint);
          const { data: products } = await response.json();

          if (products.length > 0) {
            products.forEach((product: any, index: number) => {
              expect(
                product.price,
                `Product at index ${index} has invalid price`,
              ).toBeGreaterThanOrEqual(min);
              expect(product.price).toBeLessThanOrEqual(max);
            });
          }
        });

        test.info().annotations.push({ type: "description", description });
      });
    }
  },
);
