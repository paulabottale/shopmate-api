import { z } from "zod";
export const productCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive()
});
export const productUpdateSchema = productCreateSchema.partial();
