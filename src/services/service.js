import { clientDb } from "../config/db.js";
import { ObjectId } from "mongodb";
import {productModel} from "../models/product.js";
import { ZodError } from "zod";
import { envVariables } from "../config/envVariables.js";
const {PORT} = envVariables
const urlBackend = `http://localhost:${PORT}`

const getProducts = async (page, limitResults) => {
    try {

        const skipResults = (page - 1) * limitResults;
        const total = await clientDb.collection("products").countDocuments();
        
        if (total === 0) {
            return {
                data: [],
                page,
                limit: limitResults,
                totalPages: 0,
                total
            };
        }

        const products = await clientDb.collection("products").find().skip(skipResults).limit(limitResults).toArray();

        return {
            data: products || [],
            page,
            limit: limitResults,
            totalPages: Math.ceil(total / limitResults),
            total
        };
    } catch (err) {
        console.error('Error fetching products:', err);
        throw new Error("Database query failed");
    }
}

const getProduct = async (id) => {
    try{
        const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!product){
            return {
                data: null,
                message: `Product of id: ${id} not found`
            }
        }

        return product;
    }catch(err){
        console.log('Error', err);
        throw new Error("Database query failed");
    }

} 

const getByName = async (productName) => {
    try{
        const product = await clientDb.collection("products").findOne({name:productName});
        return product;
    }catch(err){
        console.error("Error", err);
        throw new Error("Database query failed");
    }
}

const newProduct = async (product) => {
    try {
        const formatedProduct = {
            ...product,
            price: parseFloat(product.price),
            pieces: parseInt(product.pieces),
            picture:`${urlBackend}/${product.picture}`
        }
        const validProduct = productModel.parse(formatedProduct);
        const result = await clientDb.collection("products").insertOne(validProduct);
        if(!result){
            return {
                data: null,
                message: "Error creating product"
            }
        }
        return {
            data: result,
            message: "Product created successfully"
        }
    } catch (err) {
        if (err instanceof ZodError) {
            // Extraer y estructurar los errores
            const errores = err.errors.map(err => ({
                campo: err.path.join('.'),
                mensaje: err.message,
            }));
            return {
                data: null,
                message: "Error creating product",
                errors: errores
            }
        }
        console.error(err);
        throw new Error("Database query failed");
    }
}

const updateProduct = async (id,parameters) => {
    try{
        const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!product){
           return {
               data: null,
               message: `Product with the id ${id} not found`
           }
        }

        
        const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: parameters });

      return{
        data: result,
        message: "Product updated successfully"
      }
        
    }catch(err){
        console.log('Error', err);
        throw new Error("Database query failed");
    }
}

const updateImage = async (id,picture) => {
    if(!picture){
        return {
            data: null,
            message: "No picture found"
        }
    }
    const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
    if(!product){
        return {
            data: null,
            message: `Product of id: ${id} not found`
        }
    }

    const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { picture:`${urlBackend}/${picture}` }});


    return {
        data: result,
        message: "Picture updated successfully"
    }
}

const deleteProduct = async (id) => {
    const product = await clientDb.collection("products").deleteOne({ _id: ObjectId.createFromHexString(id) });
    if(!product){
       return{
        data: null,
        message: `Product of id: ${id} not found`
       }
    }

    return {
        data: product,
        message: "Product deleted successfully"
    }

}
export {
    newProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    updateImage,
    getByName
}