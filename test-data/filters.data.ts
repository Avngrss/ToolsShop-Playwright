export interface FilterTestCase {
  name: string;
  url: string;
  fieldName: string;
  expectedValue: string;
  description: string;
  skip?: boolean;
}

export const FILTER_TESTS: FilterTestCase[] = [
  {
    name: "category",
    url: "/products?page=0&between=price,1,100&by_category=01KR1P483XDMGSPZNK4PZ2BBWV&is_rental=false",
    fieldName: "name",
    expectedValue: "hammer",
    description: "Filter by category returns correct products",
    skip: false,
  },
  {
    name: "brand",
    url: "/products?page=0&between=price,1,100&by_brand=01KR1P483XDMGSPZNK4PZ2BBWV&is_rental=false",
    fieldName: "brand.name",
    expectedValue: "forgeflex",
    description: "Filter by brand returns correct products",
    skip: true,
  },
  {
    name: "eco-friendly",
    url: "/products?page=0&between=price,1,100&eco_friendly=true&is_rental=false",
    fieldName: "is_eco_friendly",
    expectedValue: "true",
    description: "Filter by eco-friendly returns sustainable products",
    skip: false,
  },
];
