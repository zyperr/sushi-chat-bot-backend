import { clientDb } from "../config/db.js";
import {hashPassword,verifyHash} from "../security/hashing.js"
import { createToken } from "../security/token.js";
import { ObjectId } from "mongodb";
import {userModel,userLoginModel} from "../models/users.js";
import { ZodError } from "zod";
import {filterSchema} from "../schema/filtro.js"

const createUser = async (user,res) =>  {
    try{
        //It validates user data with userModel
        const validUser = userModel.parse(user);
        if(!validUser){
            return res.status(400).send("User data is invalid")
        }
    
        const userExists = await clientDb.collection("users").findOne({name: validUser.name});
        if(userExists){
            return res.status(400).send("User already exists")
        }

        let newUser = {
            ...validUser,
            password: await hashPassword(validUser.password)
        }
            
        const result = await clientDb.collection("users").insertOne(newUser);

        if(!result){
            return res.status(500).send("Error creating the user")
        }
        console.log(newUser)
        res.status(201).json({
            data: result,
            message: "User created successfully"    
        });
        
    }catch(err){
        if (err instanceof ZodError) {
            // Extraer y estructurar los errores
            const errores = err.errors.map(err => ({
              campo: err.path.join('.'),
              mensaje: err.message,
            }));
        return res.status(400).json({ errores });
    }

    }
}



const login = async (user, res) => {
    try {
        const validUser = userLoginModel.parse(user);
        const userExists = await clientDb.collection("users").findOne({ name: validUser.name });

        if (!userExists) {
            return res.status(404).send("User not found");

        }

        const passwordMatch = await verifyHash(validUser.password, userExists.password);

        if (!passwordMatch) {
            return res.status(401).send("Invalid password");
        }

        const token = createToken(userExists._id);

        if (!token) {
            return res.status(500).json({ message: 'Token generation failed' });
        }

        return res.json({ message: 'Login successful', token });
    } catch (err) {
        if (err instanceof ZodError) {
            const errores = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            return res.status(400).json({ errores });
        }
        
        console.error('Unexpected error occurred:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
const getMe = async (id,res) => {
    const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id)});
    if(!user){
        res.status(404).json({message:`User with the id ${id} not found`});
    }
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
const updateUserOrder = async (id,orderId,res) => {
    await clientDb.collection("users").updateOne({ _id: ObjectId.createFromHexString(id) }, { $push: { order: orderId } });
}

const getOrderUser = async (id,res,querys) => {
    try {
        const user = await clientDb.collection("users").findOne({ _id: ObjectId.createFromHexString(id)});
        if(!user){
            res.status(404).json({message:`User with the id ${id} not found`});
            return;
        }

        const f = filterSchema.parse(querys);

        const {state,from,to,limit} = f;
        const filterDict = {};


        if(state){filterDict.state = state};
        if(from || to){
            filterDict.date = {};
            if(from) filterDict.date.$gte = from;
            if(to) filterDict.date.$lte = to;
        }
       

        const limitResults = limit ? parseInt(limit) : 10;
        const orders = await clientDb.collection("orders").find(filterDict).limit(limitResults).toArray();
        
        if(orders.length === 0){
            res.status(200).json({message:"User has no order nothing yet",orders:[]});
            return;
        }

        res.status(200).json({orders});
    } catch (err) {
        if (err instanceof ZodError) {
            const errors = err.errors.map(error => ({
                campo: error.path.join('.'),
                mensaje: error.message,
            }));
            return res.status(400).json({ errors });
        }
    }
}

const deleteOrderFromUser = async (id,orderId,res) => {
    if(!orderId){
        res.status(400).json({message:"Missing required fields (orderId)"});
    }
    await clientDb.collection("users").updateOne({ _id: ObjectId.createFromHexString(id) }, { $pull: { order: ObjectId.createFromHexString(orderId) } });
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