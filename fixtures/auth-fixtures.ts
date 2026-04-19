import { test as base, expect } from "./checkA11y.fixture";
import { AuthFactory } from "../test-data/auth-factory";
import type { LoginCredentials } from "../types/auth";

type AuthFixtures = {
  testUser: LoginCredentials;
  adminUser: LoginCredentials;
};

export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    await use(AuthFactory.getTestUser());
  },
  adminUser: async ({}, use) => {
    await use(AuthFactory.getAdminUser());
  },
});
export { expect };
