import { z, ZodType } from "zod";

export function validateSchema<T>(data: unknown, schema: ZodType<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error("Validation failed:", error);
    if (error instanceof z.ZodError) {
      throw new Error(`Schema validation failed: ${error.message}`);
    }
    throw new Error(`Unexpected error during validation: ${error}`);
  }
}
