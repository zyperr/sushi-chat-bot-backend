import { Router } from "express";
import {newProduct,getProducts,getProduct,updateProduct, deleteProduct,updateImage} from "../services/service.js";
import {upload} from "../config/staticFiles.js";

const router = Router();

router.get("/products",async(req,res) => {
    try{
        const products = await getProducts(res);
        return res.status(200).send(products);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
router.get("/products/:id",async (req,res) => {
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
router.post("/products",upload.single("picture"),async (req,res) => {
    try{
        const name= req.body?.name;
        const price= req.body?.price;
        const picture= req.file?.filename
        const pieces = req.body?.pieces
        
        if (!name || !price || !picture || !pieces) {
            return res.status(400).send("Missing required fields")
        }
        const product = {name,price,picture,pieces};
        return newProduct(product,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


router.put("/products/:id",async (req,res) => {
    try{
        const id = req.params?.id
        const productData = {...req.body};
        
        return await updateProduct(id,productData,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

})


router.patch("/products/:id",upload.single("picture"),async (req,res) => {

    try{
        const id = req.params?.id;
        const picture = req.file?.filename;

        return await updateImage(id,res,picture);

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    }
})


router.delete("/products/:id",async (req,res) => {
    try{
        const id = req.params?.id
        
        return await deleteProduct(id,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router