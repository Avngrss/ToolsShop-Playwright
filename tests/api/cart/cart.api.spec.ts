import { test, expect } from "../../../fixtures";
import { setAllureMeta } from "../../../utils/allure-utils";
import { validateSchema } from "../../../utils/validateSchema";
import {
  CartSchema,
  AddToCartResponseSchema,
  ProductsListSchema,
  ValidationErrorSchema,
} from "../../../schemas/cart-product.schema";

test.describe("Cart API", { tag: ["@api", "@cart", "@smoke"] }, () => {
  test("User can create cart and add product", async ({ request }) => {
    await setAllureMeta({
      title: "Cart API - Create & Add (Guest)",
      description: "Verify guest can create cart and add item via API",
      severity: "critical",
      priority: "P0",
      owner: "QA Team",
      suite: "Cart",
      feature: "Add to Cart",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "POST /cart/items",
        Method: "POST",
        RequestBody:
          "{ productId: <valid>, quantity: <valid>, guestSession: true }",
        ExpectedStatus: "201",
      },
    });

    let cartId: string;
    let productId: string;

    await test.step("Create new cart", async () => {
      const createRes = await request.post("/carts");
      expect([200, 201]).toContain(createRes.status());
      const body = await createRes.json();
      cartId = body.id;
      expect(cartId).toBeTruthy();
    });

    await test.step("Get available product", async () => {
      const productsRes = await request.get("/products?page=1&is_rental=false");
      expect(productsRes.status()).toBe(200);
      const products = validateSchema(
        await productsRes.json(),
        ProductsListSchema,
      );
      expect(products.data.length).toBeGreaterThan(0);
      productId = products.data[0].id;
    });

    await test.step("Add product to cart", async () => {
      const addRes = await request.post(`/carts/${cartId}`, {
        data: { product_id: productId, quantity: 1 },
      });
      expect(addRes.status()).toBe(200);
      const addResult = validateSchema(
        await addRes.json(),
        AddToCartResponseSchema,
      );
      expect(addResult.result).toBe("item added or updated");
    });

    await test.step("Verify product is in cart via GET", async () => {
      const cartRes = await request.get(`/carts/${cartId}`);
      expect(cartRes.status()).toBe(200);
      const cart = validateSchema(await cartRes.json(), CartSchema);

      expect(cart.cart_items).toBeDefined();
      const found = cart.cart_items.some(
        (i: any) => i.product_id === productId,
      );
      expect(found).toBeTruthy();
    });
  });

  test("Adding product with invalid ID returns 422 and keeps cart unchanged", async ({
    request,
    setupCart,
  }) => {
    await setAllureMeta({
      title: "Cart API - Add Product with Invalid ID (Negative)",
      description:
        "Verify that adding a product with invalid ID returns 422 and keeps cart unchanged",
      severity: "critical",
      priority: "P1",
      owner: "QA Team",
      suite: "Cart",
      feature: "Add to Cart - Validation",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "POST /cart/items",
        Method: "POST",
        RequestBody: "{ productId: <invalid>, quantity: 1 }",
        ExpectedStatus: "422",
        CartState: "unchanged",
        ErrorField: "productId",
      },
    });
    const { cartId, productId } = await setupCart();
    const invalidProductId = "00000000-0000-0000-0000-000000000000";

    await test.step("Send request with non-existent product_id", async () => {
      const res = await request.post(`/carts/${cartId}`, {
        data: { product_id: invalidProductId, quantity: 1 },
      });

      expect(res.status()).toBe(422);
      const errorBody = validateSchema(await res.json(), ValidationErrorSchema);
      expect(errorBody.errors).toHaveProperty("product_id");
      expect(errorBody.message).toContain("invalid");
    });

    await test.step("Verify no side effects on cart state", async () => {
      const cartRes = await request.get(`/carts/${cartId}`);
      const cart = validateSchema(await cartRes.json(), CartSchema);
      const hasFake = cart.cart_items.some(
        (i) => i.product_id === invalidProductId,
      );
      expect(hasFake).toBeFalsy();
      const originalItem = cart.cart_items.find(
        (i) => i.product_id === productId,
      );
      expect(originalItem?.quantity).toBe(1);
    });
  });

  test("Sending negative quantity returns 422 and keeps cart unchanged", async ({
    request,
    setupCart,
  }) => {
    await setAllureMeta({
      title: "Cart API - Add Product with Negative Quantity (Negative)",
      description:
        "Verify that sending a negative quantity returns 422 and keeps cart unchanged",
      severity: "critical",
      priority: "P1",
      owner: "QA Team",
      suite: "Cart",
      feature: "Add to Cart - Validation",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "POST /cart/items",
        Method: "POST",
        RequestBody: "{ productId: <valid>, quantity: <negative> }",
        ExpectedStatus: "422",
        CartState: "unchanged",
        ErrorField: "quantity",
      },
    });
    const { cartId, productId } = await setupCart();

    await test.step("Try to add negative quantity", async () => {
      const res = await request.post(`/carts/${cartId}`, {
        data: { product_id: productId, quantity: -1 },
      });
      expect(res.status()).toBe(422);
    });

    await test.step("Verify cart state remains unchanged after error", async () => {
      const cartRes = await request.get(`/carts/${cartId}`);
      const cart = validateSchema(await cartRes.json(), CartSchema);
      const item = cart.cart_items.find((i) => i.product_id === productId);
      expect(item?.quantity).toBe(1);
    });
  });

  test("Can remove item from cart", async ({ request, setupCart }) => {
    await setAllureMeta({
      title: "Cart API - Remove Item from Cart",
      description:
        "Verify that an existing item can be successfully removed from the cart",
      severity: "critical",
      priority: "P1",
      owner: "QA Team",
      suite: "Cart",
      feature: "Remove from Cart",
      parameters: {
        Browser: test.info().project.name,
        Endpoint: "DELETE /cart/items/{itemId}",
        Method: "DELETE",
        RequestBody: "{ itemId: <valid> }",
        ExpectedStatus: "200",
        CartState: "item removed, totals recalculated",
      },
    });
    const { cartId, productId } = await setupCart();

    await test.step("Remove product", async () => {
      const res = await request.delete(`/carts/${cartId}/product/${productId}`);
      expect([200, 204]).toContain(res.status());
    });

    await test.step("Verify cart is empty or item gone", async () => {
      const cartRes = await request.get(`/carts/${cartId}`);
      const cart = validateSchema(await cartRes.json(), CartSchema);

      const stillExists = cart.cart_items.some(
        (i) => i.product_id === productId,
      );
      expect(stillExists).toBeFalsy();
    });
  });
});
