import {orderModel} from "../models/order.js"
import {updateUserOrder} from "./userService.js"
import { ZodError } from "zod"
import { clientDb } from "../config/db.js"
import { ObjectId } from "mongodb"
const createOrder = async (order, res) => {
    try {
        
        const { userId, products,date,state } = orderModel.parse(order);
        
        if (!userId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Data's not valid" });
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
            return res.status(400).json({ message: "Products not found" });
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
            return res.status(500).json({ message: "Could not create order" });
        }

        await updateUserOrder(userId, result.insertedId, res);
        return res.status(201).json({ message: "Order created successfully", data: result });
    } catch (err) {
        if (err instanceof ZodError) {
            const errores = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            return res.status(400).json({ errores });
        } else if (err instanceof Error) {
            return res.status(500).json({ message: err.message });
        }
    }
}


export {
    createOrder
}