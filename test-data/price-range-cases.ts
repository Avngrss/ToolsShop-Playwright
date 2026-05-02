export interface PriceRangeCase {
  min: number;
  max: number;
  label: string;
  description: string;
}

export const BASE_PRODUCT_QUERY = "page=0&is_rental=false";

export const priceRangeCases: PriceRangeCase[] = [
  {
    min: 1,
    max: 200,
    label: "Full range (1-200)",
    description: "Verify products within full allowed price range",
  },
  {
    min: 0,
    max: 0,
    label: "Lower boundary (0-0)",
    description: "Verify filtering with min=max=0 (edge case)",
  },
  {
    min: 200,
    max: 200,
    label: "Upper boundary (200-200)",
    description: "Verify filtering with min=max=200 (edge case)",
  },
  {
    min: 100,
    max: 150,
    label: "Middle range (100-150)",
    description: "Verify filtering with typical mid-range values",
  },
];
