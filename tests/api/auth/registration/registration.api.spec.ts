import { expect, test } from "@playwright/test";
import { createUser } from "../../../../utils/userFactory";
import { validateSchema } from "../../../../utils/validateSchema";
import { registerResponseSchema } from "../../../../schemas/register.schema";
import {
  weakPasswords,
  invalidEmails,
  emptyLikePasswords,
} from "../../../../test-data/auth-validation";
import { setAllureMeta } from "../../../../utils/allure-utils";

type ApiErrorBody = Record<string, string[]>;

test.describe("Register user API", { tag: ["@api", "@auth"] }, () => {
  test(
    "Successful user registration",
    { tag: ["@smoke"] },
    async ({ request }) => {
      await setAllureMeta({
        title: "Register - Successful User Registration",
        description:
          "Verify that new user can register with valid data and receives 201 with user object (no password)",
        severity: "critical",
        priority: "P0",
        owner: "QA Team",
        suite: "Auth",
        feature: "Register",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /users/register",
          Method: "POST",
          RequestBody: "{ email, password, first_name, last_name and so on}",
          ExpectedStatus: "201",
        },
      });
      const user = createUser();
      const response = await request.post("/users/register", {
        data: user,
      });

      expect(response.status()).toBe(201);
      const json = await response.json();

      expect(json.id).toBeTruthy();
      expect(json.email).toBe(user.email.toLowerCase());
      expect(json).not.toHaveProperty("password");
      validateSchema(json, registerResponseSchema);
    },
  );

  for (const item of weakPasswords) {
    test(
      `Should return 422 for weak password: ${item.label}`,
      {
        tag: ["@negative", "@password-policy"],
      },
      async ({ request }) => {
        await setAllureMeta({
          title: `Register - Weak Password: ${item.label}`,
          description: `Verify registration fails with 422 when password is too weak: ${item.label}`,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Auth",
          feature: "Register",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "POST /users/register",
            Method: "POST",
            TestCase: `Weak password: ${item.label}`,
            ExpectedError: item.expectedPattern.toString(),
            ExpectedStatus: "422",
          },
        });
        const user = createUser({ password: item.password });

        const response = await request.post("/users/register", {
          data: user,
        });

        expect(response.status()).toBe(422);
        const json = (await response.json()) as ApiErrorBody;

        expect(json.password).toBeTruthy();
        expect(Array.isArray(json.password)).toBe(true);
        expect(json.password[0]).toMatch(item.expectedPattern);
      },
    );
  }

  for (const item of emptyLikePasswords) {
    test(
      `Should return 422 for empty-like password: ${item.label}`,
      {
        tag: ["@negative", "@validation"],
      },
      async ({ request }) => {
        await setAllureMeta({
          title: `Register - Empty-like Password: ${item.label}`,
          description: `Verify registration fails with 422 when password is empty-like: ${item.label}`,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Auth",
          feature: "Register",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "POST /users/register",
            Method: "POST",
            TestCase: `Empty-like password: ${item.label}`,
            ExpectedError: item.expectedPattern.toString(),
            ExpectedStatus: "422",
          },
        });
        const user = createUser({ password: item.password });

        const response = await request.post("/users/register", {
          data: user,
        });

        expect(response.status()).toBe(422);
        const json = (await response.json()) as ApiErrorBody;

        expect(json.password).toBeTruthy();
        expect(json.password[0]).toMatch(item.expectedPattern);
      },
    );
  }

  for (const item of invalidEmails) {
    test(
      `Email format "${item.label}": ${item.shouldFail ? "should fail" : "should pass"}`,
      { tag: ["@negative", "@validation"] },
      async ({ request }) => {
        await setAllureMeta({
          title: `Register - Email Format: ${item.label}`,
          description: `Verify email format validation: ${item.label} - ${item.shouldFail ? "should fail" : "should pass"}`,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Auth",
          feature: "Register",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "POST /users/register",
            Method: "POST",
            TestCase: `Email format: ${item.label}`,
            ShouldFail: item.shouldFail.toString(),
            ExpectedStatus: item.shouldFail ? "422" : "201 or 409",
          },
        });
        test.skip(
          item.shouldFail,
          "Backend does not validate email format strictly - validation is UI-only",
        );

        const uniqueEmail =
          item.label.includes("@") || item.email.includes("@")
            ? `${item.email.split("@")[0]}${Date.now()}@${item.email.split("@")[1] || "example.com"}`
            : `${item.email}${Date.now()}`;

        const user = createUser({ email: uniqueEmail });

        const response = await request.post("/users/register", { data: user });

        if (item.shouldFail) {
          expect(response.status()).toBe(422);
          const json = (await response.json()) as ApiErrorBody;
          expect(json.email).toBeTruthy();
        } else {
          expect([201, 409]).toContain(response.status());
        }
      },
    );
  }

  const requiredFields = [
    "email",
    "password",
    "first_name",
    "last_name",
  ] as const;

  for (const field of requiredFields) {
    test(
      `Should return 422 when ${field} is missing`,
      {
        tag: ["@negative", "@validation"],
      },
      async ({ request }) => {
        await setAllureMeta({
          title: `Register - Missing Required Field: ${field}`,
          description: `Verify registration fails with 422 when required field "${field}" is missing`,
          severity: "normal",
          priority: "P1",
          owner: "QA Team",
          suite: "Auth",
          feature: "Register",
          parameters: {
            Browser: test.info().project.name,
            Endpoint: "POST /users/register",
            Method: "POST",
            MissingField: field,
            ExpectedError: "required",
            ExpectedStatus: "422",
          },
        });
        const user = createUser();
        const payload: any = { ...user };
        delete payload[field];

        const response = await request.post("/users/register", {
          data: payload,
        });

        expect(response.status()).toBe(422);
        const json = (await response.json()) as ApiErrorBody;

        expect(json[field]).toBeTruthy();
        expect(json[field][0]).toMatch(/required/i);
      },
    );
  }

  test(
    "Should return 409 when email already exists",
    {
      tag: ["@negative", "@conflict"],
    },
    async ({ request }) => {
      await setAllureMeta({
        title: "Register - Duplicate Email Conflict",
        description:
          "Verify that registering with an already-used email returns 409 Conflict",
        severity: "normal",
        priority: "P1",
        owner: "QA Team",
        suite: "Auth",
        feature: "Register",
        parameters: {
          Browser: test.info().project.name,
          Endpoint: "POST /users/register",
          Method: "POST",
          TestCase: "Duplicate email registration",
          ExpectedStatus: "409",
        },
      });
      const duplicateEmail: string = `dup-${Date.now()}@example.com`;
      const firstResponse = await request.post("/users/register", {
        data: createUser({ email: duplicateEmail }),
      });
      expect(firstResponse.status()).toBe(201);
      const secondResponse = await request.post("/users/register", {
        data: createUser({ email: duplicateEmail }),
      });

      expect(secondResponse.status()).toBe(409);
      const json = await secondResponse.json();
      const errorText = JSON.stringify(json).toLowerCase();
      expect(errorText).toMatch(/exists|taken|conflict|already/i);
    },
  );
});
