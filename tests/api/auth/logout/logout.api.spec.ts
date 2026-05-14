import { APIResponse, expect, test } from "@playwright/test";
import { loginApi } from "../../../../fixtures/api/api-login.helpers";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe("Logout API", { tag: ["@api", "@auth"] }, () => {
  test(
    "Should successfully logout",
    { tag: ["@smoke"] },
    async ({ request, playwright }) => {
      const apiClient = await loginApi(request, playwright);

      await setAllureMeta({
        title: "Logout - Successful Logout",
        description:
          "Verify that authenticated user can logout and receives success confirmation",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Auth",
        feature: "Logout",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "GET /users/logout",
          Method: "GET",
          AuthRequired: "Yes (Bearer token)",
          ExpectedStatus: "200",
        },
      });

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
