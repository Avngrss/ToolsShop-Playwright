import { test, expect, APIResponse } from "@playwright/test";
import { validateSchema } from "../../../../utils/validateSchema";
import { filterSchema } from "../../../../schemas/filter.schema";
import { FILTER_TESTS } from "../../../../test-data/filters.data";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe("Product Filters API", { tag: ["@api", "@filters"] }, () => {
  for (const testData of FILTER_TESTS) {
    test(testData.description, async ({ request }) => {
      await setAllureMeta({
        title: `Filters - ${testData.name}`,
        description: testData.description,
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Products",
        feature: "Filters",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /products",
          Method: "GET",
          QueryParams: testData.url,
          FilterField: testData.fieldName,
          ExpectedValue: testData.expectedValue,
          ExpectedStatus: "200",
        },
      });
      test.skip(testData.skip ?? false, "Filter not implemented yet");

      let response: APIResponse;
      let json: any;

      await test.step("Send request with filter parameters", async () => {
        response = await request.get(testData.url);
      });

      await test.step("Verify response status and schema", async () => {
        expect(response.status()).toBe(200);
        json = await response.json();
        validateSchema(json, filterSchema);
      });

      await test.step("Verify filtered products content", async () => {
        if (json.data.length > 0) {
          json.data.forEach((product: any) => {
            const actualValue = testData.fieldName
              .split(".")
              .reduce((obj, key) => obj[key], product);

            if (testData.expectedValue === "true") {
              expect(actualValue).toBe(true);
            } else {
              expect(actualValue.toLowerCase()).toContain(
                testData.expectedValue,
              );
            }
          });
        } else {
          console.log(
            `${testData.name}: Empty result set (DB might be empty, but API works).`,
          );
        }
      });
    });
  }

  test("Combined filters (Category + Eco) return correct intersection", async ({
    request,
  }) => {
    await setAllureMeta({
      title: "Filters - Combined Category + Eco",
      description:
        "Verify that applying multiple filters (category + eco_friendly) returns correct intersection of products",
      severity: "normal",
      priority: "P1",
      owner: "QA Team",
      suite: "Products",
      feature: "Filters",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "GET /products",
        Method: "GET",
        QueryParams:
          "page=0&between=price,1,100&by_category=...&is_eco_friendly=true&is_rental=false",
        Filters: "category + price range + eco_friendly",
        ExpectedStatus: "200",
      },
    });
    const combinedUrl =
      "/products?page=0&between=price,1,100&by_category=01KR1P483XDMGSPZNK4PZ2BBWV&is_eco_friendly=true&is_rental=false";

    await test.step("Send request with multiple filters", async () => {
      const response = await request.get(combinedUrl);
      expect(response.status()).toBe(200);

      const json = await response.json();
      validateSchema(json, filterSchema);

      if (json.data.length > 0) {
        json.data.forEach((product: any) => {
          expect(product.category.name.toLowerCase()).toContain("hammer");
          expect(product.is_eco_friendly).toBe(true);
        });
      } else {
        console.log(
          "Combined filters: Empty result (Intersection might be empty in current DB)",
        );
      }
    });
  });

  test("Invalid category ID returns empty result or 400", async ({
    request,
  }) => {
    await setAllureMeta({
      title: "Filters - Invalid Category ID",
      description:
        "Verify that filtering by invalid category ID returns 400/404 or empty result without crashing",
      severity: "normal",
      priority: "P2",
      owner: "QA Team",
      suite: "Products",
      feature: "Filters",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "GET /products",
        Method: "GET",
        QueryParams: "by_category=invalid-id-123&is_rental=false",
        ExpectedStatus: "400 or 404",
      },
    });
    const invalidUrl =
      "/products?page=0&by_category=invalid-id-123&is_rental=false";

    await test.step("Send request with invalid ID", async () => {
      const response = await request.get(invalidUrl);
      expect([400, 404]).toContain(response.status());
      if (response.status() === 200) {
        const json = await response.json();
        validateSchema(json, filterSchema);
        expect(json.data).toHaveLength(0);
      }
    });
  });
});
