import test from "@playwright/test";
import {
  BASE_PRODUCT_QUERY,
  co2SortCases,
} from "../../../../test-data/sorting-cases";
import {
  fetchAndValidateProducts,
  validateSortingOrder,
} from "../../../../helpers/sorting.helper";

test.describe(
  "Sort Products by CO2 Rating",
  { tag: ["@api", "@sorting", "@co2"] },
  () => {
    for (const { field, direction, label } of co2SortCases) {
      test(`Sort ${label} (${direction.toUpperCase()})`, async ({
        request,
      }) => {
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
