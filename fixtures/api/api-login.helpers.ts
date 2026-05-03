// fixtures/api/api-login.helpers.ts
import { APIRequestContext } from "@playwright/test";
import { LoginResponse } from "../../types/auth";
import { testUser } from "../../utils/envUser";

const API_BASE =
  process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginApi(
  request: APIRequestContext,
  playwright: any,
): Promise<APIRequestContext> {
  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await request.post(`${API_BASE}/users/login`, {
      data: { email: testUser.email, password: testUser.password },
    });
    if (response.status() === 423 || response.status() === 429) {
      await delay(1000 * attempt);
      continue;
    }
    break;
  }
  if (response?.status() === 423 || response?.status() === 429)
    throw new Error("Login blocked by rate limit");
  if (!response?.ok()) throw new Error(`Login failed: ${response?.status()}`);
  const body = (await response.json()) as LoginResponse;
  if (!body.access_token) throw new Error("access_token is missing");
  return await playwright.request.newContext({
    extraHTTPHeaders: { Authorization: `Bearer ${body.access_token}` },
  });
}
