import { test as base, expect } from "./visual.fixture";
import { authFetch, getAuthToken } from "../utils/auth.api";
import { testUser as defaultTestUser } from "../utils/envUser";
import type { LoginCredentials } from "../types/auth";
import { APIResponse } from "playwright";

interface AuthenticatedApi {
  get: (url: string, opt?: any) => Promise<APIResponse>;
  post: (url: string, data?: any, opt?: any) => Promise<APIResponse>;
  put: (url: string, data?: any, opt?: any) => Promise<APIResponse>;
  delete: (url: string, opt?: any) => Promise<APIResponse>;
}

export interface AuthFixtures {
  testUser: LoginCredentials;
  adminUser: LoginCredentials;
  authRequest: AuthenticatedApi;
}

export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    await use(defaultTestUser);
  },
  adminUser: async ({}, use) => {
    await use({
      email: process.env.TEST_ADMIN_EMAIL!,
      password: process.env.TEST_ADMIN_PASSWORD!,
    });
  },
  authRequest: async ({ request, testUser }, use) => {
    const token = await getAuthToken(request, testUser);
    const api: AuthenticatedApi = {
      get: (u, o) => authFetch(request, token, u, { ...o, method: "GET" }),
      post: (u, d, o) =>
        authFetch(request, token, u, { ...o, method: "POST", data: d }),
      put: (u, d, o) =>
        authFetch(request, token, u, { ...o, method: "PUT", data: d }),
      delete: (u, o) =>
        authFetch(request, token, u, { ...o, method: "DELETE" }),
    };
    await use(api);
  },
});
export { expect };
