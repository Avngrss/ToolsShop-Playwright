import { User, PartialUser } from "../types/auth";
import { generateUniqueEmail } from "./emailGenerator";

export const createUser = (partialUser: PartialUser = {}): User => {
  return {
    first_name: "John",
    last_name: "Doe",
    dob: "1990-01-01",
    country: "Canada",
    postal_code: "12345",
    house_number: "23",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    phone: "1234567890",
    email: partialUser.email || generateUniqueEmail("user"),
    password: "Strong@password123!",
    ...partialUser,
  };
};
