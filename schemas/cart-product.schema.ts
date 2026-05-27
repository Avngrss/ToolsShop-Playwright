import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  in_stock: z.boolean(),
  is_rental: z.boolean(),
});

export const CartItemSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity: z.number(),
  product: ProductSchema,
});

export const CartSchema = z.object({
  id: z.string(),
  cart_items: z.array(CartItemSchema),
  additional_discount_percentage: z.null().or(z.number()),
});

export const AddToCartResponseSchema = z.object({
  result: z.string(),
});

export const ProductsListSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number().optional(),
  page: z.number().optional(),
});

export const ValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
