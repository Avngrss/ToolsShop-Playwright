import { test as base, expect } from "./auth.fixture";

export interface CartFixtures {
  setupCart: (
    productId?: string,
    quantity?: number,
  ) => Promise<{ cartId: string; productId: string }>;
}

export const test = base.extend<CartFixtures>({
  setupCart: async ({ request }, use) => {
    const API_BASE = process.env.API_URL;
    const setup = async (
      productId?: string,
      quantity = 1,
    ): Promise<{ cartId: string; productId: string }> => {
      const r1 = await request.post(`${API_BASE}/carts`);
      if (!r1.ok()) throw new Error("Cart creation failed");
      const { id: cartId } = (await r1.json()) as { id: string };
      let finalProductId = productId;
      if (!finalProductId) {
        const r2 = await request.get(
          `${API_BASE}/products?page=1&is_rental=false`,
        );
        const { data } = (await r2.json()) as { data: Array<{ id: string }> };

        if (!data?.length) throw new Error("No products available");
        finalProductId = data[0].id;
      }
      const r3 = await request.post(`${API_BASE}/carts/${cartId}`, {
        data: { product_id: finalProductId, quantity },
      });
      if (!r3.ok()) throw new Error("Add product failed");

      return { cartId, productId: finalProductId };
    };

    await use(setup);
  },
});
export { expect };
