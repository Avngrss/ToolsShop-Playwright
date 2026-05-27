import { APIRequestContext, APIResponse } from "@playwright/test";
import { LoginResponse } from "../types/auth";
import { testUser } from "./envUser";

const API_BASE =
  process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";

export async function getAuthToken(
  request: APIRequestContext,
  credentials = testUser,
): Promise<string> {
  const res = await request.post(`${API_BASE}/users/login`, {
    data: credentials,
  });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()}`);
  const { access_token } = (await res.json()) as LoginResponse;
  return access_token;
}

export async function authFetch(
  request: APIRequestContext,
  token: string,
  url: string,
  options?: Parameters<typeof request.fetch>[1],
): Promise<APIResponse> {
  const res = await request.fetch(url, {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${token}` },
  });
  if (!res.ok()) throw new Error(`Request failed: ${res.status()}`);
  return res;
}
