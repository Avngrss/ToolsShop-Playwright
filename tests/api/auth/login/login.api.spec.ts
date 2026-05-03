import { APIResponse, expect, test } from "@playwright/test";
import { testUser } from "../../../../utils/envUser";
import { invalidLoginPayloads } from "../../../../test-data/auth-validation";
import { validateSchema } from "../../../../utils/validateSchema";
import { loginResponseSchema } from "../../../../schemas/auth.schema";

test.describe("Login API", { tag: ["@api", "@auth"] }, () => {
  const endpoint = "/users/login";

  test(
    "Should successful login into the app - 200",
    { tag: ["@smoke"] },
    async ({ request }) => {
      let response: APIResponse;

      await test.step("Send login request with valid credentials", async () => {
        response = await request.post(endpoint, {
          data: { email: testUser.email, password: testUser.password },
        });
      });

      await test.step("Verify status code and response schema", async () => {
        expect(response.status()).toBe(200);
        const json = await response.json();
        validateSchema(json, loginResponseSchema);
      });
    },
  );

  for (const tc of invalidLoginPayloads) {
    test(
      `Should return 401 with "${tc.expectedError}" for ${tc.label}`,
      { tag: ["@negative"] },
      async ({ request }) => {
        let response: APIResponse;

        await test.step("Send login request with invalid payload", async () => {
          response = await request.post(endpoint, { data: tc });
        });

        await test.step("Verify 401 status and error message", async () => {
          expect(response.status()).toBe(401);
          const json = await response.json();
          expect(json.error).toBe(tc.expectedError);
        });
      },
    );
  }
});
