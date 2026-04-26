import { createUser } from "../utils/userFactory";

export const registrationNegativeCases = [
  {
    label: "empty form",
    qaseCaseId: "?suite=...&case=...",
    data: {
      first_name: "",
      last_name: "",
      dob: "",
      country: "",
      postal_code: "",
      house_number: "",
      street: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      password: "",
    },
  },
  {
    label: "weak password",
    qaseCaseId: "?suite=...&case=...",
    data: createUser({
      email: `test-${Date.now()}@example.com`,
      password: "123",
    }),
  },
  {
    label: "duplicate email",
    qaseCaseId: "?suite=...&case=...",
    data: createUser({
      email: "customer@practicesoftwaretesting.com",
      password: "Strong@password123!",
      first_name: "Duplicate",
      last_name: "Test",
    }),
  },
];
