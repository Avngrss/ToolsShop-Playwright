import { APIResponse, expect, test } from "@playwright/test";
import { testUser } from "../../../../utils/envUser";
import { validateSchema } from "../../../../utils/validateSchema";
import {
  forgotPasswordSchema,
  forgotPasswordErrorSchema,
} from "../../../../schemas/forgot-password.schema";
import { setAllureMeta } from "../../../../utils/allure-utils";

test.describe("Forgot password API", { tag: ["@api", "@auth"] }, () => {
  const endpoint = "/users/forgot-password";

  test(
    "Should successful forgot password - 200",
    { tag: ["@smoke"] },
    async ({ request }) => {
      await setAllureMeta({
        title: "Forgot Password - Valid Email Success",
        description:
          "Verify that requesting password reset with valid email returns 200 and confirmation",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Auth",
        feature: "Forgot Password",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /users/forgot-password",
          Method: "POST",
          RequestBody: "{ email: <valid_email> }",
          ExpectedStatus: "200",
        },
      });
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
      await setAllureMeta({
        title: "Forgot Password - Non-existent Email",
        description:
          "Verify that requesting password reset with invalid email returns 422 error",
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Auth",
        feature: "Forgot Password",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /users/forgot-password",
          Method: "POST",
          RequestBody: "{ email: does-not-exist@practicesoftwaretesting.com }",
          ExpectedStatus: "422",
        },
      });
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
