import z from "zod";



const filterSchema = z.object({
    state: z.enum(["pendiente", "entregado", "cancelado"]).optional(),
    from : z.string().optional().default(),
    to : z.string().optional().default(),
    category: z.string().optional(),
})


const handleQuerys = (querys) => {
    try {
        let f = filterSchema.parse(querys);
        const { state, from, to, category, price } = f;

        const filterDict = {};

        if (state) filterDict.state = state;
        if (from || to) {
            filterDict.date = {};
            if (from) filterDict.date.$gte = from;
            if (to) filterDict.date.$lte = to;
        }
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