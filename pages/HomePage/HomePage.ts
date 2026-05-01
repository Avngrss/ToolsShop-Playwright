import { Page } from "@playwright/test";
import { Header } from "../../components/Header.component";
import { SortingComponent } from "../../components/Sorting.component";

export class HomePage {
  readonly page: Page;
  readonly header: Header;
  readonly sortingComponent: SortingComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.sortingComponent = new SortingComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }
}
