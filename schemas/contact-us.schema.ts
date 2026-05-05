import { z } from "zod";

export const contactUsSchema = z.object({
  name: z.string(),
  subject: z.string(),
  message: z.string(),
  email: z.string(),
  status: z.string(),
  id: z.string(),
  created_at: z.string(),
});

export const contactUsAttachSchema = z.object({ success: z.boolean() });
