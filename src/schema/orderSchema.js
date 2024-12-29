import { clientDb } from "../config/db";

clientDb.createCollection("orders",{
    
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["usuarioId", "productos", "estado", "fecha"],
            properties: {
                usuarioId: {
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
                
              }
            }
          }
        }
            
})