import { Router } from "express";
import {newProduct,getProducts,getProduct,getByName,updateProduct, deleteProduct,updateImage} from "../services/service.js";
import {upload} from "../config/staticFiles.js";
import {authenticateToken} from "../security/token.js";
import { verifyRole } from "../security/verifyRole.js";
import {getUser} from "../services/userService.js";
import { ObjectId } from "mongodb";

const router = Router();
const endpoint = "/v1/products"

router.get(endpoint,async(req,res) => {
    try{
        const page = parseInt(req.query?.page, 10) || 1;
        const limitResults = parseInt(req.query?.limit, 10) || 10;

        const products = await getProducts(page,limitResults);
        if(!products){
            return res.status(404).json({message:"Products not found",data:products.data});
        }
        return res.status(200).json(products);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})
router.get(`${endpoint}/:id`,async (req,res) => {
    try{
        const id = req.params?.id
        if(!id){
            return res.status(400).json({
                message:"Missing required fields"
            })
        }

        const response =  await getProduct(id,res);

        return res.status(200).json(response);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})

router.get(`${endpoint}/name/:name`,async (req,res) => {
    try{
        const name = req.params.name;
        console.log(name)
        const product = await getByName(name);
        if(!product){
            return res.status(404).json({message:`Product with the name ${name} not found`});
        }
        return res.status(200).json(product);

    }catch(err){
        console.error("Error", err);
        return res.status(500).json({ message: "Internal server error",error:err.message });
    }
})

router.post(`${endpoint}/admin`,authenticateToken,upload.single("picture"),async (req,res) => {
    try{
        const name= req.body?.name;
        const price= parseFloat(req.body?.price);
        const picture= req.file?.filename
        const pieces = parseInt(req.body?.pieces)
        
        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);

        if(!access){
            return res.status(403).json({message:"Access denied"});
        }
        const product = {name,price,picture,pieces};
        
        const response = await newProduct(product);

        if(!response.data){
            return res.status(400).json({message:response.message});
        }

        return res.status(200).json(response);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})


router.put(`${endpoint}/admin/:id`,authenticateToken,async (req,res) => {
    try{
        const id = req.params?.id
        const productData = {...req.body};

        
        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);

        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid id"});
        }
        if(!access){
            return res.status(403).json({message:"Access denied"});
        }
        const response = await updateProduct(id,productData);

        if(!response.data){
            res.status(404).json({message:response.message});
        }

        return res.status(200).json(response);
    }catch(err){
        console.error('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})


router.patch(`${endpoint}/admin/:id`,upload.single("picture"),authenticateToken,async (req,res) => {

    try{
        const id = req.params?.id;
        const picture = req.file?.filename;

        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);
        
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid id"});
        }
        if(!access){
            return res.status(403).json({message:"Access denied"});
        }

        const response = await updateImage(id,picture);
        
        if(!response.data){
            return res.status(response.status).json({message:response.message});
        }

        return res.status(200).json(response);

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error",error:err.message})
    }
})


router.delete(`${endpoint}/admin/:id`,authenticateToken,async (req,res) => {
    try{
        const id = req.params?.id
        const {role} = await getUser(req.user?.id);
        const {access} = await verifyRole(role,res);

        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid id"});
        }
        if(!access){
            return res.status(403).json({message:"Access denied"});
        }

        const response = await deleteProduct(id);
        if(!response.data){
            return res.status(404).json({message:response.message});    
        }
        return res.status(200).json(response);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error',error:err.message });
    }
})

export default router