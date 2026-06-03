import { test as base, expect } from "./cart-ui.fixture";
import { createUser } from "../utils/userFactory";
import type { User } from "../types/auth";

export interface TestUserFixtures {
  createTestUser: () => Promise<{ email: string; password: string }>;
}

export const test = base.extend<TestUserFixtures>({
  createTestUser: async ({ request }, use) => {
    const createUserAndReturnCreds = async (): Promise<{
      email: string;
      password: string;
    }> => {
      const API_BASE =
        process.env.API_URL || "https://api.practicesoftwaretesting.com";
      const fullUser: User = createUser();

      const res = await request.post(`${API_BASE}/users/register`, {
        data: fullUser,
      });

      if (!res.ok() && res.status() !== 422) {
        const errorText = await res.text();
        console.error(
          `Registration failed [${res.status()}]:`,
          errorText.slice(0, 300),
        );
        throw new Error(`Registration failed: ${res.status()}`);
      }
      return {
        email: fullUser.email,
        password: fullUser.password,
      };
    };
    await use(createUserAndReturnCreds);
  },
});
export { expect };
