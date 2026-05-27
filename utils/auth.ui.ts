import { Page, APIRequestContext } from "@playwright/test";
import { LoginResponse } from "../types/auth";
import { testUser } from "./envUser";

const API_BASE =
  process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";

export async function loginUi(
  page: Page,
  request: APIRequestContext,
  credentials = testUser,
): Promise<void> {
  const response = await request.post(`${API_BASE}/users/login`, {
    data: credentials,
  });

  if (!response.ok()) throw new Error(`Login failed: ${response.status()}`);

  const { access_token } = (await response.json()) as LoginResponse;
  if (!access_token) throw new Error("access_token is missing");

  await page.addInitScript((token) => {
    window.localStorage.setItem("auth-token", token);
  }, access_token);
}
