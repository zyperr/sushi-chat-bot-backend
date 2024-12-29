import z from "zod";



export const filterSchema = z.object({
    state: z.enum(["pendiente", "entregado", "cancelado"]).optional().default("pendiente"),
    from : z.string().optional().default(new Date().toISOString().slice(0, 10)),
    to : z.string().optional().default(new Date().toISOString().slice(0, 10)),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').default("1").optional(),
})