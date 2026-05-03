import { Page, APIRequestContext, BrowserContext } from "@playwright/test";
import { LoginResponse } from "../../types/auth";
import { testUser } from "../../utils/envUser";

const API_BASE =
  process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginUi(
  page: Page,
  request: APIRequestContext,
): Promise<BrowserContext> {
  let response,
    lastError: string | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await request.post(`${API_BASE}/users/login`, {
      data: { email: testUser.email, password: testUser.password },
    });
    if (response.status() === 423 || response.status() === 429) {
      lastError = `Rate limited: ${response.status()}`;
      await page.waitForTimeout(1000 * attempt);
      continue;
    }
    break;
  }
  if (response?.status() === 423 || response?.status() === 429)
    throw new Error(`Login blocked: ${lastError}`);
  if (!response?.ok()) throw new Error(`Login failed: ${response?.status()}`);
  const body = (await response.json()) as LoginResponse;
  if (!body.access_token) throw new Error("access_token is missing");
  await page.addInitScript((token) => {
    window.localStorage.setItem("auth-token", token);
  }, body.access_token);
  return page.context();
}
