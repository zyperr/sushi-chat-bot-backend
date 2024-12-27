import { clientDb } from "../config/db.js";
import { ObjectId } from "mongodb";
import {productModel} from "../models/product.js";
import { ZodError } from "zod";
import { envVariables } from "../config/envVariables.js";

const {PORT} = envVariables
const urlBackend = `http://localhost:${PORT}`

const getProducts = async (res) => {
    try{
        const products = await clientDb.collection("products").find().toArray();
        return products;
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getProduct = async (id,res) => {
    try{
        const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!product){
            res.status(404).json({message:`Product with the id ${id} not found`});
        }

        return res.status(200).json(product);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

} 

const newProduct = async (product,res) => {
    try {
        const formatedProduct = {
            ...product,
            price: parseFloat(product.price),
            pieces: parseInt(product.pieces),
            picture:`${urlBackend}/${product.picture}`
        }
        const validProduct = productModel.parse(formatedProduct);
        const result = await clientDb.collection("products").insertOne(validProduct);
        return res.status(201).json({
            data: result,
            message: "Product created successfully"
        });
    } catch (err) {
        if (err instanceof ZodError) {
            // Extraer y estructurar los errores
            const errores = err.errors.map(err => ({
                campo: err.path.join('.'),
                mensaje: err.message,
            }));
            return res.status(400).json({ errores });
        }
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProduct = async (id,parameters,res) => {
    try{
        const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!product){
            res.status(404).json({message:`Product with the id ${id} not found`});
        }

        
        const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: parameters });

        res.status(200).json({
            data: result,
            message: "Product updated successfully"
        });
        
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateImage = async (id,res,picture) => {
    if(!picture){
        res.status(400).json({message:"Missing required fields (picture)"})
    }
    const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
    if(!product){
        res.status(404).json({message:`Product with the id ${id} not found`});
    }

    const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { picture:`${urlBackend}/${picture}` }});

    res.status(200).json({
        data: result,
        message: "Picture updated successfully"
    });
}

const deleteProduct = async (id,res) => {
    const product = await clientDb.collection("products").deleteOne({ _id: ObjectId.createFromHexString(id) });
    if(!product){
        res.status(404).json({message:`Product with the id ${id} not found`});
    }
    res.status(200).json({
        data: product,
        message: "Product deleted successfully"
    })

}
export {
    newProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    updateImage
}