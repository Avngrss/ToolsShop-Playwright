import { APIResponse } from "@playwright/test";
import { expect, test } from "../../../../fixtures/authToken.fixture";

test.describe("Logout API", { tag: ["@api", "@auth"] }, () => {
  test(
    "Should successfully logout",
    { tag: ["@smoke"] },
    async ({ apiClient }) => {
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
    },
  );
});
