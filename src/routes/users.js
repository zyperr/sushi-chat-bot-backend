import { Router } from "express";
import { createUser,getMe,login,getOrderUser,deleteOrderFromUser} from "../services/userService.js";
import { authenticateToken } from "../security/token.js";
import { userModel,userLoginModel } from "../models/users.js";
import { ZodError } from "zod";
const router = Router();

const endpoint = "/v1/users"
router.post(`${endpoint}/register`,async(req,res) => {
    try{
        const user = req.body;
        const validUser = userModel.parse(user);
        
        const response = await createUser(validUser);
        if(!response.user){
            return res.status(response.status).json({message:response.message});
        }
        return res.json(response);
    }catch(err){
        if(err instanceof ZodError){
            return res.status(400).json({message:err.issues[0].message});
        }
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})

router.post(`${endpoint}/login`,async(req,res) => {
    try{
        const user = req.body;
        const validUserLogin = userLoginModel.parse(user);


        const response = await login(validUserLogin);

        if(!response.user){
            return res.status(response.status).json({message:response.message});
        }

        console.log(response)
        return res.status(200).json(response);
    }catch(err){
        console.error('Error', err);
        if(err instanceof ZodError){
            return res.status(400).json({message:err.issues[0].message});
        }
    }
    
})

router.post(`${endpoint}/logout`,async(req,res) => {
    return res.status(200).json({message:"Logout successful"});
})


router.get(`${endpoint}/me`,authenticateToken , async (req,res) => {
    const id = req.user.id
    const response = await getMe(id)
    if(!response){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json(response);
})
router.get(`${endpoint}/getOrders`,authenticateToken , async (req,res) => {
    try{
        const id = req.user.id
        const querys = req.query
        const limit = parseInt(querys.limit) || 10;
        if(!id){
            return res.status(403).json({message:"User not authenticated"});
        }
        const response = await getOrderUser(id,querys,limit)
    
        if(!response.orders){
            return res.status(404).json({message:response.message});
        }
    
        return res.json(response);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})

router.delete(`${endpoint}/me/removeOrder/:orderId`,authenticateToken , async (req,res) => {
    const id = req.user.id
    const orderId = req.params.orderId


    if(!orderId){
        return res.status(400).json({message:"Missing required fields (orderId)"});
    }

    const response =  await deleteOrderFromUser(id,orderId)
    
    if(!response.data){
        return res.status(response.status).json({message:response.message});
    }


    return res.json(response);
})

export default router