import { Router } from "express";
import { createUser,getMe,login,getOrderUser,deleteOrderFromUser} from "../services/userService.js";
import { authenticateToken } from "../security/token.js";
const router = Router();

const endpoint = "/v1/users"
router.post(`${endpoint}/register`,async(req,res) => {
    const user = req.body;
    if(!user){
        return res.status(400).json({message:"Missing required fields"});
    }
    
    const response = await createUser(user,res);
    if(!response){
        return res.status(400).json({message:"User already exists"});
    }
    return res.json(response);
})

router.post(`${endpoint}/login`,async(req,res) => {
    const user = req.body;
    if(!user){
        return res.status(400).json({message:"Missing required fields"});
    }
    console.log("loging")
    const response = await login(user);
    return res.json(response);
})

router.post(`${endpoint}/logout`,async(req,res) => {
    return res.status(200).json({message:"Logout successful"});
})


router.get(`${endpoint}/me`,authenticateToken , async (req,res) => {
    const id = req.user.id
    const response = await getMe(id,res)
    if(!response){
        return res.status(404).json({message:"User not found"});
    }
    return res.json(response);
})
router.get(`${endpoint}/:id/order`,authenticateToken , async (req,res) => {
    const id = req.params.id
    const querys = req.query
    if(!id){
        return res.status(400).json({message:"Missing required fields"});
    }
    if(!querys){
        return res.status(400).json({message:"Missing required fields"});
    }
    const response = await getOrderUser(id,querys)
    return res.json(response);
})

router.delete(`${endpoint}/me/removeOrder/:orderId`,authenticateToken , (req,res) => {
    const id = req.user.id
    const orderId = req.params.orderId
    return deleteOrderFromUser(id,orderId,res)
})

export default router