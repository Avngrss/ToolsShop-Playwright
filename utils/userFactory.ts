import { User, PartialUser } from "../types/auth";

export const createUser = (partialUser: PartialUser = {}): User => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);

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
    email: `user${timestamp}${randomSuffix}@example.com`,
    password: "Strong@password123!",
    ...partialUser,
  };
};
