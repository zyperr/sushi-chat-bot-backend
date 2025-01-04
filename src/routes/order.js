import { Router } from "express";
import { createOrder } from "../services/orderService.js";
import {orderModel} from "../models/order.js"
import { ZodError } from "zod"
import { ObjectId } from "mongodb";


const router = Router();
const endpoint = "/v1/orders"
router.post(endpoint,async (req,res) => {
    try{
        const order = req.body;
        const validOrder = orderModel.parse(order);
        
        const {userId}  = validOrder;
        if(!ObjectId.isValid(userId)){
            return res.status(400).json({message:"User ID is not valid"});
        }
        const response = await  createOrder(validOrder);

        if(!response.acknowledged){
            return res.status(response.status).json({message:response.message})
        }

        return res.status(201).json(response);
    }catch(err){
        if(err instanceof ZodError){
            return res.status(400).json({message:err.issues[0].message});
        }
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
    
})


export default router