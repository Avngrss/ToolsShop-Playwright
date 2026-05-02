import { Page, Locator } from "@playwright/test";

export class RangeSliderComponent {
  readonly page: Page;
  readonly slider: Locator;
  readonly minHandle: Locator;
  readonly maxHandle: Locator;
  readonly productList: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slider = page.locator("ngx-slider");
    this.minHandle = page.locator(".ngx-slider-pointer-min");
    this.maxHandle = page.locator(".ngx-slider-pointer-max");
    this.productList = page.locator(
      "div[class='col-md-9'] div[class='container']",
    );
    this.emptyState = page.locator('[data-test="no-results"]');
  }

  async setRange(min: number, max: number) {
    await this.maxHandle.click();
    await this.page.waitForTimeout(100);
    if (max === 200) {
      await this.page.keyboard.press("End");
    } else if (max === 0) {
      await this.page.keyboard.press("Home");
    } else {
      await this._dragHandle(this.maxHandle, max);
    }
    await this.page.waitForTimeout(150);
    await this.minHandle.click();
    await this.page.waitForTimeout(100);
    if (min === 200) {
      await this.page.keyboard.press("End");
    } else if (min === 0) {
      await this.page.keyboard.press("Home");
    } else {
      await this._dragHandle(this.minHandle, min);
    }

    await this.page.waitForTimeout(600);
  }

  private async _dragHandle(handle: Locator, value: number) {
    const box = await this.slider.boundingBox();
    if (!box) return;
    const percent = value / 200;
    const x = box.x + box.width * percent;
    await handle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(x, box.y, { steps: 10 });
    await this.page.mouse.up();
  }
}
