import test from "@playwright/test";
import {
  BASE_PRODUCT_QUERY,
  priceSortCases,
} from "../../../../test-data/sorting-cases";
import {
  fetchAndValidateProducts,
  validateSortingOrder,
} from "../../../../helpers/sorting.helper";

test.describe(
  "Sort Products by Price",
  { tag: ["@api", "@sorting", "@price"] },
  () => {
    for (const { field, direction, label } of priceSortCases) {
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
