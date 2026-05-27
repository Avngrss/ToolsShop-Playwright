// fixtures/cart-ui.fixture.ts
import { test as base, expect } from "./a11y.fixture";
import type { CartUiFixtures } from "../types/fixtures";

export const test = base.extend<CartUiFixtures>({
  setupCartUi: async ({ request, page }, use) => {
    const setup = async (
      productId?: string,
      quantity = 1,
    ): Promise<{ cartId: string; productId: string }> => {
      const API_BASE = process.env.API_URL!;
      const BASE_URL = process.env.BASE_URL!;

      const r1 = await request.post(`${API_BASE}/carts`);
      if (!r1.ok()) throw new Error(`Cart creation failed: ${r1.status()}`);
      const { id: cartId } = (await r1.json()) as { id: string };

      let finalProductId: string = productId || "";
      if (!finalProductId) {
        const r2 = await request.get(
          `${API_BASE}/products?page=1&is_rental=false`,
        );
        const { data } = (await r2.json()) as { data: Array<{ id: string }> };
        if (!data?.length) throw new Error("No products available");
        finalProductId = data[0].id;
      }

      await request.post(`${API_BASE}/carts/${cartId}`, {
        data: { product_id: finalProductId, quantity },
      });

      await page.goto(BASE_URL);

      await page.evaluate(
        ({ id, qty }) => {
          sessionStorage.setItem("cart_id", id);
          sessionStorage.setItem("cart_quantity", String(qty));
        },
        { id: cartId, qty: quantity },
      );

      await page.reload({ waitUntil: "networkidle" });

      return { cartId, productId: finalProductId };
    };
    await use(setup);
  },
});
export { expect };
