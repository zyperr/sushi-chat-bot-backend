import { Router } from "express";
import { createOrder } from "../services/orderService.js";


const router = Router();
const endpoint = "/v1/orders"
router.post(endpoint,async (req,res) => {
    try{
        const order = req.body;
        if(!order){
            return res.status(400).json({message:"Missing required fields"});
        }
        const response = await  createOrder(order);
        if(!response){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.json(response);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
    
})


export default router