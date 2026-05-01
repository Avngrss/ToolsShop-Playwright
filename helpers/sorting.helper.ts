import { APIRequestContext, expect } from "@playwright/test";
import { SortDirection } from "../test-data/sorting-cases";
import { validateSchema } from "../utils/validateSchema";
import {
  Product,
  ProductResponseSchema,
} from "../schemas/product-response.schema";

export function validateSortingOrder<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  direction: SortDirection,
): void {
  if (!Array.isArray(items) || items.length <= 1) return;

  for (let i = 0; i < items.length - 1; i++) {
    const valA = items[i][field];
    const valB = items[i + 1][field];

    if (valA == null || valB == null) continue;

    let comparison: number;
    if (typeof valA === "string" && typeof valB === "string") {
      comparison = valA.localeCompare(valB);
    } else if (typeof valA === "number" && typeof valB === "number") {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }

    if (direction === "asc") {
      expect(
        comparison,
        `Sorting validation failed (ASC) at index ${i}: expected "${valA}" to be ≤ "${valB}"`,
      ).toBeLessThanOrEqual(0);
    } else {
      expect(
        comparison,
        `Sorting validation failed (DESC) at index ${i}: expected "${valA}" to be ≥ "${valB}"`,
      ).toBeGreaterThanOrEqual(0);
    }
  }
}

export async function fetchAndValidateProducts(
  request: APIRequestContext,
  endpoint: string,
): Promise<Product[]> {
  const response = await request.get(endpoint);
  expect(response.status()).toBe(200);
  const json = await response.json();
  const parsed = validateSchema(json, ProductResponseSchema);
  return parsed.data;
}
