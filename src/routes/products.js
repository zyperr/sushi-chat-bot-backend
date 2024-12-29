import { Router } from "express";
import {newProduct,getProducts,getProduct,updateProduct, deleteProduct,updateImage} from "../services/service.js";
import {upload} from "../config/staticFiles.js";
import {authenticateToken} from "../security/token.js";
import { verifyRole } from "../security/verifyRole.js";
import {getUser} from "../services/userService.js";

const router = Router();
const endpoint = "/v1/products"

router.get(endpoint,async(req,res) => {
    try{
        const products = await getProducts(res,req.query);
        return res.status(200).json(products);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
router.get(`${endpoint}/:id`,async (req,res) => {
    try{
        const id = req.params?.id
        if(!id){
            return res.status(400).send("Missing required fields id")
        }

        return await getProduct(id,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
router.post(`${endpoint}/admin`,upload.single("picture"),async (req,res) => {
    try{
        const name= req.body?.name;
        const price= req.body?.price;
        const picture= req.file?.filename
        const pieces = req.body?.pieces
        
        const product = {name,price,picture,pieces};
        return await newProduct(product,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


router.put(`${endpoint}/admin/:id`,authenticateToken,async (req,res) => {
    try{
        const id = req.params?.id
        const productData = {...req.body};

        
        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);
        if(!access){
            return res.status(403).json({message:"Access denied"});
        }
        return await updateProduct(id,productData,res,req.user);
    }catch(err){
        console.error('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


router.patch(`${endpoint}/admin/:id`,upload.single("picture"),authenticateToken,async (req,res) => {

    try{
        const id = req.params?.id;
        const picture = req.file?.filename;

        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);

        if(!access){
            return res.status(403).json({message:"Access denied"});
        }

        return await updateImage(id,res,picture);

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


router.delete(`${endpoint}/admin/:id`,authenticateToken,async (req,res) => {
    try{
        const id = req.params?.id
        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);

        if(!access){
            return res.status(403).json({message:"Access denied"});
        }
        return await deleteProduct(id,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router