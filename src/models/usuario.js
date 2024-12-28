import zod from "zod";



export const userModel = zod.object({
    name: zod.string().min(3,{message:"Name must be at least 3 characters"}),
    //Checks to see if the text entered is a valid email address
    email: zod.string().email().regex(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,{message:"Invalid email"}),
    /*
        - at least 8 characters
        - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
        - Can contain special characters
    */ 
    password: zod.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,{message:"Invalid password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and at least 8 characters and also special characters"}),
    role:zod.string().optional().default("user"),
    order:zod.array(zod.string()).optional().default([])
})


export const userLoginModel = zod.object({
    name: zod.string().min(3,{message:"Name must be at least 3 characters"}),
    password: zod.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,{message:"Invalid password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and at least 8 characters and also special characters"})    
})
