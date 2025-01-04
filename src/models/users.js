import zod from "zod";


const UserRole = Object.freeze({
    USER: 'user',
    ADMIN: 'admin'
  });
  
const ROLE = zod.enum([UserRole.USER, UserRole.ADMIN]);

const userModel = zod.object({
    name: zod.string({required_error:"Name is required"}).min(3,{message:"Name must be at least 3 characters"}),
    //Checks to see if the text entered is a valid email address
    email: zod.string({required_error:"Email is required"}).email({message:"Invalid email address format example: 2XW2R@example.com"}).regex(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    /*
        - at least 8 characters
        - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
        - Can contain special characters
    */ 
    password: zod.string({required_error:"Password is required"}).min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,{message:"Invalid password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and at least 8 characters and also special characters"}),

    role:ROLE.default("user"),

    order:zod.array(zod.string()).optional().default([])
})


const userLoginModel = zod.object({
    name: zod.string({required_error:"Name is required"}).min(3,{message:"Name must be at least 3 characters"}),
    password: zod.string({required_error:"Password is required"}).min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,{message:"Invalid password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and at least 8 characters and also special characters"})    
})

export {
    userModel,
    userLoginModel,
    ROLE,
    UserRole
}