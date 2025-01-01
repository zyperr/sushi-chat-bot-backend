import { clientDb } from "../config/db.js";
import {hashPassword,verifyHash} from "../security/hashing.js"
import { createToken } from "../security/token.js";
import { ObjectId } from "mongodb";
import {userModel,userLoginModel} from "../models/users.js";
import { ZodError } from "zod";
import { handleQuerys } from "../schema/filtro.js";
const createUser = async (user) =>  {
    try{
        //It validates user data with userModel
        const validUser = userModel.parse(user);
        if(!validUser){
            throw new Error("Invalid user data")
        }
    
        const userExists = await clientDb.collection("users").findOne({name: validUser.name});
        if(userExists){
           throw new Error("User already exists")
        }

        let newUser = {
            ...validUser,
            password: await hashPassword(validUser.password)
        }
            
        const result = await clientDb.collection("users").insertOne(newUser);

        if(!result){
            throw new Error("Error creating user")
        }

        return {
            message:"User created successfully",
            user:newUser
        }
        
    }catch(err){
        if (err instanceof ZodError) {
            // Extraer y estructurar los errores
            const errores = err.errors.map(err => ({
              campo: err.path.join('.'),
              mensaje: err.message,
            }));
        throw new Error(errores);
    }

    }
}



const login = async (user) => {
    try {
        const validUser = userLoginModel.parse(user);
        const userExists = await clientDb.collection("users").findOne({ name: validUser.name });

        if (!userExists) {
           throw new Error("User not found");
        }

        const passwordMatch = await verifyHash(validUser.password, userExists.password);

        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        const token = createToken(userExists._id);

        if (!token) {
           throw new Error("Error creating token");
        }

        return {
            message: "Login successful",
            token
        }
    } catch (err) {
        if (err instanceof ZodError) {
            const errores = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            throw new Error(errores);
        }
        
        console.error('Unexpected error occurred:', err);
        throw new Error("Database query failed");
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
    try {
        if (!id) {
            throw new Error("Missing required fields (id)");
        }

        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id) });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
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

        return orders
    } catch (err) {
        console.error('Error fetching orders:', err);
        if (err instanceof ZodError) {
            const errors = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            throw new Error(errors);
        }
        throw new Error("Database query failed");
    }
}

const deleteOrderFromUser = async (id,orderId,res) => {
    if(!orderId){
        res.status(400).json({message:"Missing required fields (orderId)"});
    }
    await clientDb.collection("users").updateOne({ _id: ObjectId.createFromHexString(id) }, { $pull: { order: ObjectId.createFromHexString(orderId) } });
    await clientDb.collection("orders").deleteOne({ _id: ObjectId.createFromHexString(orderId) });
    res.status(200).json({message:"Order deleted successfully"})
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