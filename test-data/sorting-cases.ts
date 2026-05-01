export type SortDirection = "asc" | "desc";

export interface SortTestCase {
  field: string;
  direction: SortDirection;
  label: string;
}

export const BASE_PRODUCT_QUERY = "page=0&between=price,1,100&is_rental=false";

export const nameSortCases: SortTestCase[] = [
  { field: "name", direction: "asc", label: "A-Z" },
  { field: "name", direction: "desc", label: "Z-A" },
];

export const priceSortCases: SortTestCase[] = [
  { field: "price", direction: "asc", label: "Low-High" },
  { field: "price", direction: "desc", label: "High-Low" },
];

export const co2SortCases: SortTestCase[] = [
  { field: "co2_rating", direction: "asc", label: "A-E" },
  { field: "co2_rating", direction: "desc", label: "E-A" },
];
