import { z } from "zod";
import { ProductSchema } from "./product-response.schema";

export const SearchResponseSchema = z.array(ProductSchema);
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
