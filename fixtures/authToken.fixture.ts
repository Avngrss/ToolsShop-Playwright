import { test as base, APIRequestContext } from "@playwright/test";
import { testUser } from "../utils/envUser";
import { LoginResponse } from "../types/auth";

interface ApiFixtures {
  apiClient: APIRequestContext;
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request, playwright }, use) => {
    const response = await request.post("/users/login", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${await response.text()}`,
      );
    }

    const body = (await response.json()) as LoginResponse;

    if (!body.access_token) {
      throw new Error(
        "[AuthFixture] Response 200 OK, but 'access_token' is missing",
      );
    }

    const authRequest = await playwright.request.newContext({
      extraHTTPHeaders: { Authorization: `Bearer ${body.access_token}` },
    });

    try {
      await use(authRequest);
    } finally {
      await authRequest.dispose();
    }
  },
});

export { expect } from "@playwright/test";
