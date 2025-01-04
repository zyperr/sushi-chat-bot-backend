import z from "zod";


export const productModel = z.object({
    name: z.string().min(3,{message:"Name must be at least 3 characters"}),
    price: z.number().min(0).positive({message:"Price must be a positive number"}),
    picture: z.string().min(3),
    pieces: z.number().min(1).max(100).positive({message:"Pieces must be a positive number"}),
    category: z.string().min(3).optional().default("sushi")
})


