import test from "@playwright/test";
import {
  BASE_PRODUCT_QUERY,
  nameSortCases,
} from "../../../../test-data/sorting-cases";
import {
  fetchAndValidateProducts,
  validateSortingOrder,
} from "../../../../helpers/sorting.helper";

test.describe(
  "Sort Products by Name",
  { tag: ["@api", "@sorting", "@name"] },
  () => {
    for (const { field, direction, label } of nameSortCases) {
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
