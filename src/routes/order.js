import { Router } from "express";
import { createOrder } from "../services/orderService.js";


const router = Router();
const endpoint = "/v1/orders"
router.post(endpoint,async (req,res) => {
    const order = req.body;

    return createOrder(order,res);
})


export default router