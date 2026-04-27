import { z } from "zod";

export const forgotPasswordSchema = z.object({
  success: z.boolean(),
});

export const forgotPasswordErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
});
