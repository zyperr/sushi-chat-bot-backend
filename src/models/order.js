import z from "zod";



const orderModel = z.object({
    products: z.array(z.object(
        {
            productId:z.string({required_error:"Product ID is required"}),
            quantity:z.number({required_error:"Quantity is required"}).min(1,{message:"Quantity must be at least 1"}).max(100,{message:"Quantity cannot be greater than 100"}).positive({message:"Quantity must be a positive number"}),
            subtotal:z.number().min(0).optional().default(0)
        }
        ),{message:"Products must be an array of objects"}).default([{}]),
    total: z.number().min(0).default(0).optional(),
    date: z.string().optional().default(new Date().toISOString().slice(0, 10)),
    userId: z.string({required_error:"User ID is required"}),
    state: z.string().default("pendiente")
})

export {
    orderModel,
}