import { clientDb } from "../config/db.js";
import {hashPassword,verifyHash} from "../security/hashing.js"
import { createToken } from "../security/token.js";
import { ObjectId } from "mongodb";
import {userModel,userLoginModel} from "../models/usuario.js";
import { ZodError } from "zod";



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
            name: validUser.name,
            email: validUser.email,
            password: await hashPassword(validUser.password),
            role: "user"
        }
            
        const result = await clientDb.collection("users").insertOne(newUser);

        if(!result){
            return res.status(500).send("Error creating the user")
        }

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

    res.status(200).json(user);
}
export {
    createUser,
    login,
    getMe
}