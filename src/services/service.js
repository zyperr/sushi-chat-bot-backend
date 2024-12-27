import { clientDb } from "../config/db.js";
import { Double, ObjectId } from "mongodb";

const port = process.env.PORT || 5000
const urlBackend = `http://localhost:${port}`

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
            res.status(404).send(`Product with the id ${id} not found`);
        }

        return res.status(200).send(product);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

} 

const newProduct = async (product,res) => {
    try {
        const formatedProduct = {
            ...product,
            price: new Double(product.price),
            pieces: parseInt(product.pieces),
            picture:`${urlBackend}/${product.picture}`
        }

        const result = await clientDb.collection("products").insertOne(formatedProduct);
        return res.status(201).send({
            data: result,
            message: "Product created successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProduct = async (id,parameters,res) => {
    try{
        const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!product){
            res.status(404).send(`Product with the id ${id} not found`);
        }

        
        const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: parameters });

        res.status(200).send({
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
        res.status(400).send("Missing required fields (picture)")
    }
    const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(id)});
    if(!product){
        res.status(404).send(`Product with the id ${id} not found`);
    }

    const result = await clientDb.collection("products").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { picture:`${urlBackend}/${picture}` }});

    res.status(200).send({
        data: result,
        message: "Picture updated successfully"
    });
}

const deleteProduct = async (id,res) => {
    const product = await clientDb.collection("products").deleteOne({ _id: ObjectId.createFromHexString(id) });
    if(!product){
        res.status(404).send(`Product with the id ${id} not found`);
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