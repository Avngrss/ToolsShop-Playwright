export interface PaginationTestCase {
  name: string;
  url: string;
  expectedPage: number;
  expectedPerPage: number;
  description: string;
  priority: "P0" | "P1" | "P2";
  skip?: boolean;
}

export const PAGINATION_TESTS: PaginationTestCase[] = [
  {
    name: "default",
    url: "/products?page=1&is_rental=false",
    expectedPage: 1,
    expectedPerPage: 9,
    description: "Default pagination returns first page",
    priority: "P0",
    skip: false,
  },
  {
    name: "page-2",
    url: "/products?page=2&is_rental=false",
    expectedPage: 2,
    expectedPerPage: 9,
    description: "Navigate to second page (page=2)",
    priority: "P0",
    skip: false,
  },
  {
    name: "page-3",
    url: "/products?page=3&is_rental=false",
    expectedPage: 3,
    expectedPerPage: 9,
    description: "Navigate to third page (page=3)",
    priority: "P1",
    skip: false,
  },
  {
    name: "custom-per-page-5",
    url: "/products?page=1&per_page=5&is_rental=false",
    expectedPage: 1,
    expectedPerPage: 5,
    description: "Custom per_page=5 limits results",
    priority: "P1",
    skip: false,
  },
  {
    name: "custom-per-page-20",
    url: "/products?page=1&per_page=20&is_rental=false",
    expectedPage: 1,
    expectedPerPage: 20,
    description: "Custom per_page=20 returns more results",
    priority: "P1",
    skip: false,
  },
];
