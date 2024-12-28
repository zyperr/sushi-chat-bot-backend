import { Router } from "express";
import { createOrder } from "../services/orderService.js";


const router = Router();

router.post("/v1/orders",async (req,res) => {
    const order = req.body;

    return createOrder(order,res);
})


export default router