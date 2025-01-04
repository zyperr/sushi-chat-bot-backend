import z from "zod";



const filterSchema = z.object({
    state: z.enum(["pendiente", "entregado", "cancelado"]).optional(),
    category: z.string().optional(),
    total: z.string().optional(),
    price : z.string().optional()
})


const handleQuerys = (querys) => {
    try {
        let f = filterSchema.parse(querys);
        const { state, category, price,total } = f;

        const filterDict = {};

        if (state) filterDict.state = state;
        if (total) filterDict.total = parseInt(total);
        if (price) filterDict.price = parseInt(price, 10);
        if (category) filterDict.category = category;
        return { filterDict };
    } catch (err) {
        console.error('Error parsing querys:', err);
        return { filterDict: {} };
    }
}



export {
    handleQuerys
}