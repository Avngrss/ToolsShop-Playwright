import type {
  NegativeLoginCase,
  InvalidLoginPayload,
  PasswordValidationCase,
  EmailValidationCase,
} from "../types/auth";

export const negativeLoginCases: NegativeLoginCase[] = [
  {
    label: "empty form",
    email: "",
    password: "",
    errorField: "emailError",
    expectedMessage: "Email is required",
    qaseCaseId: "?suite=2&case=29",
  },
  {
    label: "wrong credentials",
    email: "user@example.com",
    password: "wrongPassword",
    errorField: "loginError",
    expectedMessage: "Invalid email or password",
    qaseCaseId: "?suite=2&case=5",
  },
];

export const invalidLoginPayloads: InvalidLoginPayload[] = [
  {
    label: "empty email",
    email: "",
    password: "welcome01",
    expectedError: "Invalid login request",
    statusCode: 400,
  },
  {
    label: "empty password",
    email: "customer@test.com",
    password: "",
    expectedError: "Invalid login request",
    statusCode: 400,
  },
  {
    label: "both empty",
    email: "",
    password: "",
    expectedError: "Invalid login request",
    statusCode: 400,
  },
  {
    label: "wrong credentials",
    email: "fake@test.com",
    password: "wrong",
    expectedError: "Unauthorized",
    statusCode: 401,
  },
];

export const weakPasswords: PasswordValidationCase[] = [
  {
    label: "too short",
    password: "Short1!",
    expectedPattern: /at least 8 characters/i,
  },
  {
    label: "no uppercase",
    password: "nouppercase1!",
    expectedPattern: /uppercase/i,
  },
  {
    label: "no lowercase",
    password: "NOLOWERCASE1!",
    expectedPattern: /lowercase/i,
  },
  {
    label: "no digit",
    password: "NoDigit@password",
    expectedPattern: /number/i,
  },
  { label: "no symbol", password: "NoSpecial123", expectedPattern: /symbol/i },
];

export const emptyLikePasswords: PasswordValidationCase[] = [
  { label: "only spaces", password: "        ", expectedPattern: /required/i },
  { label: "empty string", password: "", expectedPattern: /required/i },
];

export const invalidEmails: EmailValidationCase[] = [
  { label: "spaces in email", email: "user name@test.com", shouldFail: true },
  { label: "no @ symbol", email: "userexample.com", shouldFail: true },
  { label: "double @", email: "user@@test.com", shouldFail: true },
  { label: "no domain extension", email: "user@test.", shouldFail: true },
];
