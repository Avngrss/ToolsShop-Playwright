import { Page } from "@playwright/test";
import { Header } from "../../components/Header.component";
import { SortingComponent } from "../../components/Sorting.component";
import { RangeSliderComponent } from "../../components/RangeSlider.component";

export class HomePage {
  readonly page: Page;
  readonly header: Header;
  readonly sortingComponent: SortingComponent;
  readonly RangeSliderComponent: RangeSliderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.sortingComponent = new SortingComponent(page);
    this.RangeSliderComponent = new RangeSliderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }
}
