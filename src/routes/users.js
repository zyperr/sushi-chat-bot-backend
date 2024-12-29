import { Router } from "express";
import { createUser,getMe,login,getOrderUser,deleteOrderFromUser} from "../services/userService.js";
import { authenticateToken } from "../security/token.js";
const router = Router();

const endpoint = "/v1/users"
router.post(`${endpoint}/register`,async(req,res) => {
    const user = req.body;
    return createUser(user,res);
})

router.post(`${endpoint}/login`,async(req,res) => {
    const user = req.body;
    console.log("loging")
    return login(user,res);
})

router.post(`${endpoint}/logout`,async(req,res) => {
    return res.status(200).json({message:"Logout successful"});
})


router.get(`${endpoint}/me`,authenticateToken , (req,res) => {
    const id = req.user.id
    return getMe(id,res)
})
router.get(`${endpoint}/:id/order`,authenticateToken , (req,res) => {
    const id = req.params.id
    const querys = req.query
    return getOrderUser(id,res,querys)
})

router.delete(`${endpoint}/me/removeOrder/:orderId`,authenticateToken , (req,res) => {
    const id = req.user.id
    const orderId = req.params.orderId
    return deleteOrderFromUser(id,orderId,res)
})

export default router