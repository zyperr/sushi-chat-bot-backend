import z from "zod";


export const productModel = z.object({
    name: z.string().min(3,{message:"Name must be at least 3 characters"}),
    price: z.number().min(0).positive({message:"Price must be a positive number"}),
    picture: z.string().min(3),
    pieces: z.number().min(1).max(100)
})