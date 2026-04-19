import { z } from "zod";

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postal_code: z.string(),
});

export const registerResponseSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
  dob: z.string(),
  email: z.string(),
  id: z.string(),
  created_at: z.string(),
  address: AddressSchema,
});
