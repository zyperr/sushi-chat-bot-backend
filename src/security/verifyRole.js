import { ZodError } from "zod";
import { ROLE } from "../models/users.js";


const verifyRole =(role,res)  => {
    try{

        if(role !== ROLE.Values.admin){
           return {
               message:"Access denied, only admin",
               access:false
           }; 
        }
        return {
            message:"Access granted",
            access:true
        };
    }catch(err){
        if(err instanceof ZodError){
            return res.status(400).json({message:err.message})
        }
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export {verifyRole}