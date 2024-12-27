import { clientDb } from "../config/db";

clientDb.createCollection("orders",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["products", "total","date",],
            properties: {
                products:{
                    bsonType:"array",
                    items:{
                        bsonType:"object",
                        required: ["productId", "quantity","subtotal"],
                        properties: {
                            productId: {
                                bsonType:"ObjectId",
                                description: "must be an ObjectId and is required",
                            },
                            quantity: {
                                bsonType:"number",
                                description: "must be a number and is required",
                                minimun:1,
                                max:100
                            },
                            subtotal: {
                                bsonType:"double",
                                description: "must be a number and is required",
                                minimun:0
                            }
                        }
                    }
                },
                total:{
                    bsonType:"double",
                    description: "must be a number and is required",
                    minimun:0
                },
                date: {
                    bsonType:"date",
                    description: "must be a date and is required",
                }
            }
        }
    }
})