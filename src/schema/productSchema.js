import { clientDb } from "../config/db.js";
clientDb.createCollection("products",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "price", "picture", "pieces"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: ["double"],
                    description: "must be a number and is required",
                    minimun:0
                },
                picture: {
                    bsonType: "string",
                    description: "must be a string and is required",
                },
                pieces: {
                    bsonType: "number",
                    description: "must be a number and is required",
                    minimun:1,
                    max:100
                },
                category: {
                    bsonType: "string",
                    description: "must be a string and is required",
                    example:"sushi"
                },
            }
        }
    }
}).then(() => {
    console.log("Sushi collection created successfully");
}).catch((err) => {
    console.error(err);
});


