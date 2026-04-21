import { test as base, Page } from "@playwright/test";
import { testUser } from "../utils/envUser";
import { LoginResponse } from "../types/auth";

interface UiAuthFixtures {
  authPage: Page;
}

export const test = base.extend<UiAuthFixtures>({
  authPage: async ({ page, request }, use) => {
    const apiBase =
      process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";
    const response = await request.post(`${apiBase}/users/login`, {
      data: { email: testUser.email, password: testUser.password },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${await response.text()}`,
      );
    }

    const body = (await response.json()) as LoginResponse;
    if (!body.access_token) {
      throw new Error(
        "[UI Auth Fixture] API returned 200 but 'access_token' is missing",
      );
    }

    await page.addInitScript((token) => {
      window.localStorage.setItem("auth-token", token);
    }, body.access_token);

    await use(page);
  },
});

export { expect } from "@playwright/test";
