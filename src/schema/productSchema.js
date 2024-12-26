import { clientDb } from "../config/db.js";
const productSchema = clientDb.createCollection("products",{
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
                    description: "must be a number and is required"
                },
                picture: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                pieces: {
                    bsonType: "number",
                    description: "must be a number and is required"
                }
            }
        }
    }
}).then(() => {
    console.log("Sushi collection created successfully");
}).catch((err) => {
    console.error(err);
});


