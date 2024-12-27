import { Router } from "express";
import { createUser,getMe,login } from "../services/userService.js";
import { authenticateToken } from "../security/token.js";
const router = Router();


router.post("/v1/users/register",async(req,res) => {
    const user = req.body;
    return createUser(user,res);
})

router.post("/v1/users/login",async(req,res) => {
    const user = req.body;
    console.log("loging")
    return login(user,res);
})

router.post("/v1/users/logout",async(req,res) => {
    return res.status(200).json({message:"Logout successful"});
})


router.get("/v1/users/me",authenticateToken , (req,res) => {
    const id = req.user.id
    return getMe(id,res)
})

export default router