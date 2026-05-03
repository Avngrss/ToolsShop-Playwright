import { APIResponse, expect, test } from "@playwright/test";
import { loginApi } from "../../../../fixtures/api/api-login.helpers";

test.describe("Logout API", { tag: ["@api", "@auth"] }, () => {
  test(
    "Should successfully logout",
    { tag: ["@smoke"] },
    async ({ request, playwright }) => {
      const apiClient = await loginApi(request, playwright);

      try {
        let response: APIResponse;
        await test.step("Send logout request", async () => {
          response = await apiClient.get("/users/logout");
        });

        await test.step("Verify 200 status and success message", async () => {
          expect(response.status()).toBe(200);
          expect(await response.json()).toMatchObject({
            message: "Successfully logged out",
          });
        });
      } finally {
        await apiClient.dispose();
      }
    },
  );
});
