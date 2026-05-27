import { APIResponse, BrowserContext } from "@playwright/test";
import { LoginCredentials } from "../types/auth";
import { AxeResults } from "axe-core";

export interface UserFixtures {
  testUser: LoginCredentials;
  adminUser: LoginCredentials;
}

export interface AuthFixtures {
  authRequest: AuthenticatedApi;
  adminAuthRequest: AuthenticatedApi;
  loginUiContext: BrowserContext;
}

export interface CartFixtures {
  setupCart: (
    productId?: string,
    quantity?: number,
  ) => Promise<{
    cartId: string;
    productId: string;
  }>;
}

export interface A11yFixtures {
  checkA11y: (
    pageName: string,
    options?: {
      severities?: Array<"critical" | "serious" | "moderate" | "minor">;
      strict?: boolean;
      debug?: boolean;
    },
  ) => Promise<AxeResults>;
}
export interface AuthenticatedApi {
  get: (url: string, options?: any) => Promise<APIResponse>;
  post: (url: string, data?: any, options?: any) => Promise<APIResponse>;
  put: (url: string, data?: any, options?: any) => Promise<APIResponse>;
  delete: (url: string, options?: any) => Promise<APIResponse>;
}

export interface CartUiFixtures {
  setupCartUi: (
    productId?: string,
    quantity?: number,
  ) => Promise<{ cartId: string; productId: string }>;
}
export type AppFixtures = UserFixtures &
  AuthFixtures &
  CartFixtures &
  A11yFixtures &
  CartUiFixtures;
