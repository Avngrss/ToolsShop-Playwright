import { APIResponse, expect, test } from "@playwright/test";
import { testUser } from "../../../../utils/envUser";
import { validateSchema } from "../../../../utils/validateSchema";
import {
  forgotPasswordSchema,
  forgotPasswordErrorSchema,
} from "../../../../schemas/forgot-password.schema";

test.describe("Forgot password API", { tag: ["@api", "@auth"] }, () => {
  const endpoint = "/users/forgot-password";

  test(
    "Should successful forgot password - 200",
    { tag: ["@smoke"] },
    async ({ request }) => {
      let response: APIResponse;

      await test.step("Send request with valid email", async () => {
        response = await request.post(endpoint, {
          data: { email: testUser.email },
        });
      });

      await test.step("Verify status code and response schema", async () => {
        expect(response.status()).toBe(200);
        const json = await response.json();
        validateSchema(json, forgotPasswordSchema);
      });
    },
  );

  test(
    "Forgot password for non-existent email returns 422",
    { tag: ["@negative"] },
    async ({ request }) => {
      let response: APIResponse;

      await test.step("Send request with invalid email", async () => {
        response = await request.post(endpoint, {
          data: { email: "does-not-exist@practicesoftwaretesting.com" },
        });
      });

      await test.step("Verify status code and response schema", async () => {
        expect(response.status()).toBe(422);
        const json = await response.json();
        validateSchema(json, forgotPasswordErrorSchema);
      });
    },
  );
});
