import { z } from "zod";

export const ProductImageSchema = z.object({
  id: z.string(),
  by_name: z.string(),
  by_url: z.string().url(),
  source_name: z.string(),
  source_url: z.string().url(),
  file_name: z.string(),
  title: z.string(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  is_location_offer: z.boolean(),
  is_rental: z.boolean(),
  co2_rating: z.string(),
  in_stock: z.boolean(),
  is_eco_friendly: z.boolean(),
  product_image: ProductImageSchema,
  category: CategorySchema,
  brand: BrandSchema,
});

export const ProductResponseSchema = z.object({
  current_page: z.number(),
  data: z.array(ProductSchema),
  from: z.number().nullable(),
  last_page: z.number(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});
export type Product = z.infer<typeof ProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
