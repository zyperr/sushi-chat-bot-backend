import z from "zod";

const state = z.enum(["pending", "completed", "cancelled"]);

export const orderModel = z.object({
    products: z.array(z.object(
        {
            productId:z.string(),
            quantity:z.number().min(1).max(100),
            subtotal:z.number().min(0).optional().default(0)
        }
        )).default([]),
    total: z.number().min(0).default(0).optional(),
    date: z.string().optional().default(new Date().toISOString().slice(0, 10)),
    userId: z.string(),
    state: state.default("pending").optional()
})