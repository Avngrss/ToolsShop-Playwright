export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface ApiErrorBody {
  email?: string[];
  password?: string[];
  message?: string;
  statusCode?: number;
}

export type ErrorField = "emailError" | "passwordError" | "loginError";

export interface NegativeLoginCase extends LoginCredentials {
  label: string;
  errorField: ErrorField;
  expectedMessage: string;
  qaseCaseId: string;
}

export interface InvalidLoginPayload {
  label: string;
  email: string;
  password: string;
  expectedError: string;
  statusCode?: number;
}

export interface PasswordValidationCase {
  label: string;
  password: string;
  expectedPattern: RegExp;
}

export interface EmailValidationCase {
  label: string;
  email: string;
  shouldFail: boolean;
  expectedPattern?: RegExp;
}

export interface User {
  first_name: string;
  last_name: string;
  dob: string;
  country: string;
  postal_code: string;
  house_number: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export type PartialUser = Partial<User>;
