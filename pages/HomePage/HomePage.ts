import { Locator, Page } from "@playwright/test";
import { Header } from "../../components/Header.component";
import { SortingComponent } from "../../components/Sorting.component";
import { RangeSliderComponent } from "../../components/RangeSlider.component";
import { SearchComponent } from "../../components/Search.component";
import { FilterComponent } from "./../../components/Filter.component";
import { PaginationComponent } from "./../../components/Pagination.component";

export class HomePage {
  readonly page: Page;
  readonly header: Header;
  readonly SortingComponent: SortingComponent;
  readonly RangeSliderComponent: RangeSliderComponent;
  readonly SearchComponent: SearchComponent;
  readonly FilterComponent: FilterComponent;
  readonly PaginationComponent: PaginationComponent;
  readonly productList: Locator;
  readonly emptyState: Locator;
  readonly firstProduct: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.SortingComponent = new SortingComponent(page);
    this.RangeSliderComponent = new RangeSliderComponent(page);
    this.SearchComponent = new SearchComponent(page);
    this.FilterComponent = new FilterComponent(page);
    this.PaginationComponent = new PaginationComponent(page);
    this.productList = page.locator(
      "div[class='col-md-9'] div[class='container']",
    );
    this.emptyState = page.locator('[data-test="no-results"]');
    this.firstProduct = page.getByRole("heading", {
      name: "Combination Pliers",
      level: 5,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async gotoProductPage(): Promise<void> {
    await this.firstProduct.click();
  }
}
