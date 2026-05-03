import { test as base } from "../core/a11y.fixture";
import { AuthFactory } from "../../test-data/auth-factory";
import type { LoginCredentials } from "../../types/auth";

type UserFixtures = {
  testUser: LoginCredentials;
  adminUser: LoginCredentials;
};

export const test = base.extend<UserFixtures>({
  testUser: async ({}, use) => {
    await use(AuthFactory.getTestUser());
  },
  adminUser: async ({}, use) => {
    await use(AuthFactory.getAdminUser());
  },
});

export { expect } from "@playwright/test";
