import { clientDb } from "../config/db.js";

clientDb.createCollection("users",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required",
                    example: "John Doe",
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required",
                    pattern: "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$",
                    example: "2XW2R@example.com"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required",
                    pattern: "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
                    example: "password123",

                },
                role:{
                    bsonType:"string",
                    enum:["admin","user"],
                    description:"must be a string and is required",
                    example:"admin"
                }
            }
        }
    }
}).then(() => console.log("User collection created"));
