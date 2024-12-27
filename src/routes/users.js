import { Router } from "express";
import { createUser,getUser,login } from "../services/userService.js";

const router = Router();


router.get("/v1/users/:id",async (req,res) => {
    const id = req.params?.id;
    return getUser(id,res);
})

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
    const user = req.body;
    return createUser(user,res);
})



export default router