import { LoginCredentials } from "../types/auth";

export class AuthFactory {
  static getTestUser(): LoginCredentials {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "Missing auth env variables. Please set TEST_USER_EMAIL and TEST_USER_PASSWORD in your .env file.",
      );
    }

    return { email, password };
  }

  static getAdminUser(): LoginCredentials {
    const email = process.env.TEST_ADMIN_EMAIL;
    const password = process.env.TEST_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "Missing auth env variables. Please set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in your .env file.",
      );
    }
    return {
      email,
      password,
    };
  }
}
