import { clientDb } from "../config/db";

clientDb.createCollection("orders",{
    
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userId", "products", "state", "date"],
            properties: {
              userId: {
                bsonType: "objectId",
              },
              productos: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["productoId", "quantity", "total"],
                  properties: {
                    productoId: {
                      bsonType: "objectId",
                    },
                    quantity: {
                      bsonType: "int",
                      minimum: 1,
                    },
                    total: {
                      bsonType: "double",
                     
                    }
                  }
                }
              },
              state: {
                bsonType: "string",
                enum: ["pendiente", "entregado", "cancelado"],
              },
              date: {
                bsonType: "date",
                required:false
              }
            }
          }
        }
            
}).then(() => {
    console.log("Collection orders created successfully");
  })
  .catch((error) => {
    console.error("Error creating collection orders:", error);
  });