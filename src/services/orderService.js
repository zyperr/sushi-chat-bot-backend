import {updateUserOrder} from "./userService.js"
import { clientDb } from "../config/db.js"
import { ObjectId } from "mongodb"
const createOrder = async (order) => {
 
        const { userId, products,date,state } = order;
        
        if (!userId || !Array.isArray(products) || products.length === 0) {

            return {
                message:"Missing required fields",
                order:[],
                status:400
            }
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        
        if (!user) {

            return {
                message:`User with ID : ${userId} not found`,
                order:[],
                status:404
            }
        }

        const detailProducts = await Promise.all(
            products.map(async (item) => {
                const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(item.productId) });
                if (!product) {
                    return {
                        message:`Product with ID : ${item.productId} not found`,
                        order :[],
                        status:404
                    }
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                };
            })
        );
        console.log(detailProducts)
        if(detailProducts[0].status === 404){
            return {
                message:detailProducts[0].message,
                order:[],
                status:404
            }
        }
        if (!detailProducts || detailProducts.length === 0) {
            return {
                message:"user has not ordered yet",
                order:[],
                status:200
            }
        }

        const total = detailProducts.reduce((sum, item) => sum + item.subtotal, 0);

        const newOrder = {
            userId: user._id,
            products: detailProducts,
            state:state|| "pendiente",
            total,
            date: date || new Date().toISOString().slice(0, 10)
        };

        const result = await clientDb.collection("orders").insertOne(newOrder);

        if (!result?.insertedId) {
            return {
                message:"Error creating the order",
                order:[],
                status:500
            }
        }

        await updateUserOrder(userId, result.insertedId);
        return result
}


export {
    createOrder
}