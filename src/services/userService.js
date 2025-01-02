import { clientDb } from "../config/db.js";
import {hashPassword,verifyHash} from "../security/hashing.js"
import { createToken } from "../security/token.js";
import { ObjectId } from "mongodb";
import {userLoginModel} from "../models/users.js";
import { ZodError } from "zod";
import { handleQuerys } from "../schema/filtro.js";
const createUser = async (user) =>  {
    
        const userExists = await clientDb.collection("users").findOne({name: user.name});
        if(userExists){
           
           return {
             message:"User already exists",
             user:[]
           }
        }

        let newUser = {
            ...user,
            password: await hashPassword(user.password)
        }
            
        const result = await clientDb.collection("users").insertOne(newUser);

        if(!result){
            return {
                message:"Error creating user",
                 user:[]
            }
        }

        return {
            message:"User created successfully",
            user:newUser
        }
    }



const login = async (user) => {

        const userExists = await clientDb.collection("users").findOne({ name: user.name });
        console.log(userExists)
        if (!userExists) {
           return {
                message:"User not found",
                user:[]
           }
        }

        const passwordMatch = await verifyHash(user.password, userExists.password);

        if (!passwordMatch) {
            return {
                message:"Invalid password",
                user:[]
            }
        }

        const token = createToken(userExists._id);

        if (!token) {
           return {
            message:"Error creating token",
            user:[]
           }
        }
        console.log(token)
        return {
            message: "Login successful",
            token,
            user:userExists._id
        }
    
}
const getMe = async (id,res) => {
    const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id)});
   const {name,email,order,role,_id} = user
    const parsedUser ={
        _id,
        name,
        email,
        order,
        role
    }
    res.status(200).json(parsedUser);
}
const getUser = async (id) => {
    const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id)});
    return {
        name:user.name,
        email:user.email,
        role:user.role
    }
}
const updateUserOrder = async (id,orderId) => {
    await clientDb.collection("users").updateOne({ _id: ObjectId.createFromHexString(id) }, { $push: { order: orderId } });
}

const getOrderUser = async (id, querys) => {

        if (!id) {
            return {
                message: "Missing required fields (id)",
                orders: []
            }
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id) });
        
        if (!user) {
            return {
                message: `User with ID ${id} not found`,
                orders: []
            }
        }

        const { filterDict } = handleQuerys(querys);
        console.log(filterDict);
        const orders = await clientDb.collection("orders").find({
            $and: [
              { _id: { $in: user.order || [] } },
              filterDict
            ]
          }).limit(10).toArray();

        if (!orders || orders.length === 0) {
            return {
                message: "User has not placed any orders yet",
                orders: []
            }
        }

        return {
            message: "Orders fetched successfully",
            orders
        }
}

const deleteOrderFromUser = async (id,orderId) => {
    const updatedUser = await clientDb.collection("users").updateOne({ _id: ObjectId.createFromHexString(id) }, { $pull: { order: ObjectId.createFromHexString(orderId) } });
    const result = await clientDb.collection("orders").deleteOne({ _id: ObjectId.createFromHexString(orderId) });
    if(!result){
        return {
            message: "Order with id not found",
            result
        }
    }
    if(!updatedUser ){
        return {
            message: "User with id not found",
            result
        }
    }
    if (updatedUser.modifiedCount === 0 || result.deletedCount === 0) {
        return {
            message: "Error deleting order from user",
            result:result
        }
    }
    return {
        message: "Order deleted successfully",
        result:result
    }
}

export {
    createUser,
    login,
    getMe,
    updateUserOrder,
    getOrderUser,
    deleteOrderFromUser,
    getUser
}