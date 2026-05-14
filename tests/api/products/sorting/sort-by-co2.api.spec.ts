import test from "@playwright/test";
import {
  BASE_PRODUCT_QUERY,
  co2SortCases,
} from "../../../../test-data/sorting-cases";
import {
  fetchAndValidateProducts,
  validateSortingOrder,
} from "../../../../helpers/sorting.helper";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe(
  "Sort Products by CO2 Rating",
  { tag: ["@api", "@sorting", "@co2"] },
  () => {
    for (const { field, direction, label } of co2SortCases) {
      test(`Sort ${label} (${direction.toUpperCase()})`, async ({
        request,
      }) => {
        await setAllureMeta({
          title: `Sorting - CO2 Rating: ${label}`,
          description: `Verify that products are sorted by ${field} in ${direction.toUpperCase()} order`,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Products",
          feature: "Sorting",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "GET /products",
            Method: "GET",
            SortField: field,
            SortDirection: direction.toUpperCase(),
            QueryParam: `sort=${field},${direction}`,
            ExpectedStatus: "200",
          },
        });
        const endpoint = `/products?${BASE_PRODUCT_QUERY}&sort=${field},${direction}`;

        const products =
          await test.step("Fetch and validate response schema", async () => {
            return await fetchAndValidateProducts(request, endpoint);
          });

        await test.step(`Verify ${label} sorting order`, async () => {
          validateSortingOrder(
            products,
            field as keyof (typeof products)[0],
            direction,
          );
        });
      });
    }
  },
);
