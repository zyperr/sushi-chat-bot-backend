import {orderModel} from "../models/order.js"
import {updateUserOrder} from "./userService.js"
import { ZodError } from "zod"
import { clientDb } from "../config/db.js"
import { ObjectId } from "mongodb"
const createOrder = async (order) => {
    try {
        
        const { userId, products,date,state } = orderModel.parse(order);
        
        if (!userId || !Array.isArray(products) || products.length === 0) {
            throw new Error("Missing required fields");
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
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
            throw new Error("Products not found");
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
            throw new Error("Error creating the order");
        }

        await updateUserOrder(userId, result.insertedId);
        return result
    } catch (err) {
        if (err instanceof ZodError) {
            const errores = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            throw new Error(errores); 
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}


export {
    createOrder
}