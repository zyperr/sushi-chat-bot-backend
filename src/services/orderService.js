import {updateUserOrder} from "./userService.js"
import { clientDb } from "../config/db.js"
import { ObjectId } from "mongodb"
const createOrder = async (order) => {
 
        const { userId, products,date,state } = order;
        
        if (!userId || !Array.isArray(products) || products.length === 0) {

            return {
                message:"Missing required fields",
                order:[]
            }
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        
        if (!user) {

            return {
                message:`User with ID : ${userId} not found`,
                order:[]
            }
        }

        const detailProducts = await Promise.all(
            products.map(async (item) => {
                const product = await clientDb.collection("products").findOne({ _id: ObjectId.createFromHexString(item.productId) });
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                };
            })
        );

        if (!detailProducts || detailProducts.length === 0) {
            return {
                message:"Products not found",
                order:[]
            }
        }

        const total = detailProducts.reduce((sum, item) => sum + item.subtotal, 0);

        const newOrder = {
            userId: user._id,
            products: detailProducts,
            state,
            total,
            date
        };

        const result = await clientDb.collection("orders").insertOne(newOrder);

        if (!result?.insertedId) {
            return {
                message:"Error creating the order",
                order:[]
            }
        }

        await updateUserOrder(userId, result.insertedId);
        return result
}


export {
    createOrder
}